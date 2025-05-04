import {
  Component,
  inject,
  ChangeDetectorRef,
  Input,
  OnInit,
  PLATFORM_ID,
  signal,
  AfterViewInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { SharedDataService } from '../../services/api-handler/shared-data.service';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { AccordionModule } from 'primeng/accordion';
import { CarouselModule } from 'primeng/carousel';

interface MetaData {
  name: string;
  size: number;
  type: string;
  num_of_variables: number;
  // total_nb_rows: number;
  // encoding: string;
}

interface ChartData {
  data: Object;
  options: Object;
}

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],
  standalone: true,
  imports: [
    SelectModule,
    CardModule,
    FormsModule,
    CommonModule,
    StepsModule,
    TableModule,
    ChartModule,
    AccordionModule,
    CarouselModule,
  ],
})
export class AnalysisComponent implements AfterViewInit {
  metadata: MetaData[] = [];
  featureDataKeys: string[] = [];
  featureDataValues: any[] = [];

  allChartsData: ChartData[] = [];
  chartData: any;
  missingChartData: any;
  chartOptions: any;

  corrMatrix: number[][] = [];
  corrMatrixFeatures: string[] = [];

  @Input() features: string[] = [];
  @Input() selectedFeature: string = '';

  filedata?: File;
  fileName: string = 'train.csv';

  constructor(
    private SDS: SharedDataService<File>,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.SDS.data$.subscribe((data) => {
      if (data) {
        this.filedata = data;
        this.fileName = data.name;
        this.loadFeatureList();
        this.pushMetadata();
      }
    });
  }

  private loadFeatureList(): void {
    this.http
      .get<any>(`http://localhost:8000/api/uploads/${this.fileName}`)
      .subscribe({
        next: (res) => {
          for (let i = 0; i < res.correlation.length; i++) {
            this.corrMatrix.push(
              Object.values(res.correlation[i]).splice(1) as number[]
            );
            this.corrMatrixFeatures.push(res.correlation[i]['Feature']);
          }
          this.features = res.features;
          this.selectedFeature = this.features[0];
          this.pushMetadata();
        },
        error: (err) => console.error('Feature list error', err),
      });
  }

  updateFeatureData(): void {
    const base = `http://localhost:8000/api/feature_data/${this.fileName}/${this.selectedFeature}`;

    this.http.get<any>(base).subscribe({
      next: (res) => {
        const data = res.feature_data[0];
        this.featureDataKeys = Object.keys(data);
        this.featureDataValues = Object.values(data);
        this.SDS.setFeatureData(this.features);
      },
      error: (err) => console.error('Feature data error', err),
    });

    this.http.get<any>(`${base}/unique`).subscribe({
      next: (res) => {
        const data = res.result.count;
        this.chartData = this.prepareChart(data);
        if (this.allChartsData.length <= 2) {
          this.allChartsData.push({
            data: this.chartData,
            options: this.chartOptions,
          });
        } else {
          this.allChartsData[0]['data'] = this.chartData;
          this.allChartsData[0]['options'] = this.chartOptions;
        }
      },
      error: (err) => console.error('Unique values error', err),
    });

    this.http.get<any>(`${base}/missing`).subscribe({
      next: (res) => {
        this.missingChartData = this.prepareChart(res.result);
        if (this.allChartsData.length <= 2) {
          this.allChartsData.push({
            data: this.missingChartData,
            options: this.chartOptions,
          });
        } else {
          this.allChartsData[1]['data'] = this.chartData;
          this.allChartsData[1]['options'] = this.chartOptions;
        }
      },
      error: (err) => console.error('Missing values error', err),
    });
  }

  private pushMetadata(): void {
    if (this.filedata && this.features.length > 0) {
      this.metadata = [
        {
          name: this.filedata.name,
          size: this.filedata.size,
          type: this.filedata.type,
          num_of_variables: this.features.length,
        },
      ];
      this.updateFeatureData();
      this.cdr.detectChanges();
    }
  }

  private prepareChart(data: Record<string, any>): any {
    const labels = Object.keys(data);
    const values = Object.values(data);
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--p-text-muted-color'
    );

    const chart = {
      labels,
      datasets: [{ data: values }],
    };

    const options =
      labels.length <= 5
        ? {
            plugins: {
              legend: {
                display: false,
              },
            },
          }
        : {
            indexAxis: 'y',
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
              legend: {
                labels: { color: textColor },
              },
            },
            scales: {
              x: {
                ticks: { color: textColorSecondary },
                grid: { drawBorder: false },
              },
              y: {
                ticks: { color: textColorSecondary },
                grid: { drawBorder: false },
              },
            },
          };

    this.chartOptions = options;
    return chart;
  }
}

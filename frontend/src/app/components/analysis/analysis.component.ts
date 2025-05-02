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

interface metaData {
  name: string;
  size: number;
  type: string;
  num_of_variables: number;
}

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],
  imports: [
    SelectModule,
    CardModule,
    FormsModule,
    CommonModule,
    StepsModule,
    TableModule,
    ChartModule,
  ],
})
export class AnalysisComponent implements AfterViewInit {
  metadata: metaData[] = [];
  featureDataKeys: string[] = [];
  featureDataValues: any[] = [];
  platformId = inject(PLATFORM_ID);

  chart_data: any;
  chart_data_labels: any;
  chart_data_dataset: any;
  options: any;

  @Input() features: string[] = [];
  @Input() selectedFeature: string = '';

  filedata: File | undefined;

  constructor(
    private SDS: SharedDataService<File>,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.SDS.data$.subscribe((data) => {
      if (data) {
        this.filedata = data;
        this.tryPushMetadata();
      }
    });

    this.http
      .get<any>('http://localhost:8000/api/uploads/train.csv')
      .subscribe({
        next: (response) => {
          this.features = response.features;
          this.selectedFeature = this.features[0];
          this.tryPushMetadata();
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        },
      });
  }

  updateFeatureData() {
    const api_url = `http://localhost:8000/api/feature_data/train.csv/`;
    this.http.get<any>(`${api_url + this.selectedFeature}`).subscribe({
      next: (response) => {
        const data = response.feature_data[0];
        this.featureDataKeys = Object.keys(data);
        this.featureDataValues = Object.values(data);

        this.SDS.setFeatureData(this.featureDataKeys);
      },
      error: (error) => {
        console.error('Error fetching data: ', error);
      },
    });

    this.http.get<any>(`${api_url + this.selectedFeature}/unique`).subscribe({
      next: (response) => {
        this.chart_data = response.result.count;
        this.chart_data_labels = Object.keys(this.chart_data);
        this.chart_data_dataset = Object.values(this.chart_data);
        console.log('this.chart_data: ', this.chart_data);
        this.initChart();
      },
      error: (error) => {
        console.error('Error fetching data: ', error);
      },
    });
  }

  private tryPushMetadata() {
    if (this.filedata && this.features.length > 0) {
      this.metadata = [];
      this.metadata.push({
        name: this.filedata.name,
        size: this.filedata.size,
        type: this.filedata.type,
        num_of_variables: this.features.length,
      });

      this.updateFeatureData();

      this.cdr.detectChanges();
    }
  }

  private initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue(
        '--p-text-muted-color'
      );

      this.chart_data = {
        labels: this.chart_data_labels,
        datasets: [
          {
            data: this.chart_data_dataset,
          },
        ],
      };

      if (this.chart_data_labels.length <= 5) {
        this.options = {
          plugins: {
            legend: {
              labels: {
                usePointStyle: true,
                color: textColor,
              },
            },
          },
        };
      } else if (this.chart_data_labels.length <= 50) {
        this.options = {
          indexAxis: 'y',
          maintainAspectRatio: false,
          aspectRatio: 0.8,
          plugins: {
            legend: {
              labels: {
                color: textColor,
              },
            },
          },
          scales: {
            x: {
              ticks: {
                color: textColorSecondary,
                font: {
                  weight: 500,
                },
              },
              grid: {
                drawBorder: false,
              },
            },
            y: {
              ticks: {
                color: textColorSecondary,
              },
              grid: {
                drawBorder: false,
              },
            },
          },
        };
      }

      this.cdr.markForCheck();
    }
  }
}

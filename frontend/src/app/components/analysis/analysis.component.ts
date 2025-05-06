// Angular Imports
import {
  Component,
  ChangeDetectorRef,
  Input,
  AfterViewInit,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Services
import { SharedDataService } from '../../services/api-handler/shared-data.service';

// Custom Components
import { CorrelationMatrixComponent } from '../correlation-matrix/correlation-matrix.component';

// Primeng Modules
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { AccordionModule } from 'primeng/accordion';
import { CarouselModule } from 'primeng/carousel';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { FeaturesChartComponent } from '../features-chart/features-chart.component';

interface MetaData {
  name: string;
  size: number;
  type: string;
  num_of_variables: number;
  // total_nb_rows: number;
  // nb_numerical_features: number;
  // nb_categorical_features: number;
  // encoding: string;
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
    CorrelationMatrixComponent,
    FeaturesChartComponent,
  ],
})
export class AnalysisComponent implements AfterViewInit {
  metadata: MetaData[] = [];
  featureDataKeys: string[] = [];
  featureDataValues: any[] = [];

  features: string[] = [];
  selectedFeature: string = '';

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
    this.SDS.getFeatureData(this.fileName).subscribe((res) => {
      this.features = res;
    });
  }

  updateFeatureData(): void {
    this.selectedFeature = this.selectedFeature.replace(' ', '_').toLowerCase();
    const base = `http://localhost:8000/api/feature_data/${this.fileName}/${this.selectedFeature}`;

    this.get<any>(base).subscribe({
      next: (res) => {
        const data = res.feature_data[0];
        this.featureDataKeys = Object.keys(data);
        this.featureDataValues = Object.values(data);
        this.SDS.setFeatureData(this.features);
      },
      error: (err) => console.error('Feature data error', err),
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

  private get<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }
}

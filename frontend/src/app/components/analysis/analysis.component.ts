import {
  Component,
  inject,
  ChangeDetectorRef,
  Input,
  OnInit,
  PLATFORM_ID,
  signal,
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
  // unique_vals_per_col: number;
  // number_of_missing_vals_per_col: number;
  // col_with_most_nulls: string;
}

interface featureData {
  distinct: number;
  disting_percent: string;
  missing: number;
  missing_percent: string;
  minimum: number;
  q1: number;
  median: number;
  q3: number;
  maximum: number;
  // zeros: number;
  // zeros_percent: string;
  // negative: number;
  // negative_percent: string;
  mean: number;
  // memory_size: number;
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
export class AnalysisComponent {
  metadata: metaData[] = [];
  featuredata: featureData[] = [];

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
          this.tryPushMetadata();
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        },
      });

    this.http
      .get<any>('http://localhost:8000/api/feature_data/train.csv/store_nbr')
      .subscribe({
        next: (response) => {
          this.featuredata = response;
          console.log('Feature Data: ', this.featuredata);
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

      this.featuredata = [];

      // this.featuredata.push({

      // })

      this.cdr.detectChanges();
    }
  }
}

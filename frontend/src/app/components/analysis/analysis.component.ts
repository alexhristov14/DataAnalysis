import {
  Component,
  inject,
  ChangeDetectorRef,
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

  features = signal<string[]>([]);
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
          this.features.set(response.features);
          this.tryPushMetadata();
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        },
      });
  }

  private tryPushMetadata() {
    if (this.filedata && this.features().length > 0) {
      this.metadata = [];
      this.metadata.push({
        name: this.filedata.name,
        size: this.filedata.size,
        type: this.filedata.type,
        num_of_variables: this.features().length,
      });

      this.cdr.detectChanges();
    }
  }
}

import { Component, ViewContainerRef, ViewChild } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { SharedDataService } from '../../services/api-handler/shared-data.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { StepsModule } from 'primeng/steps';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

interface fiveNumberSummary {
  Feature: string;
  Min: number;
  Q1: number;
  Median: number;
  Q3: number;
  Max: number;
}

interface missingValues {
  Feature: string;
  MissingValues: number;
  Percentage: number;
}

interface DFData {
  five_number_summary: fiveNumberSummary[];
  correlation: number[];
  missing_values: missingValues[];
}

interface City {
  name: string;
  code: string;
}

interface Feature {
  name: string;
}

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],
  standalone: true,
  imports: [
    ChartComponent,
    CommonModule,
    OrganizationChartModule,
    CardModule,
    StepsModule,
    SelectModule,
    FormsModule,
  ],
})
export class AnalysisComponent {
  @ViewChild('chartContainer', { read: ViewContainerRef })
  chartContainer!: ViewContainerRef;

  data!: DFData;
  five_number_summary!: fiveNumberSummary[];
  corr!: number[];
  missingValues!: missingValues[];

  items: MenuItem[] | undefined;
  activeIndex: number = 0;
  activeItem: string = 'Min';

  constructor(private SDS: SharedDataService<File>, private http: HttpClient) {}

  cities: City[] | undefined;
  selectedCity: City | undefined;

  features: Feature[] | undefined;
  selectedFeature: Feature | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Min',
      },
      {
        label: 'Q1',
      },
      {
        label: 'Median',
      },
      {
        label: 'Q3',
      },
      {
        label: 'Max',
      },
    ];

    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' },
    ];
  }

  ngAfterViewInit(): void {
    this.SDS.data$.subscribe((data) => {
      if (data) {
        console.log('Data received from SDS:', data);
      }
    });

    this.http
      .get('http://localhost:8000/api/uploads/train.csv')
      .subscribe((data) => {
        if (data) {
          this.data = data as DFData;
          this.five_number_summary = this.data.five_number_summary;
          this.corr = this.data.correlation;
          this.missingValues = this.data.missing_values;
          this.features = this.five_number_summary.map((item) => ({
            name: item.Feature,
          }));
        }
      });
  }

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
    console.log('Active index changed to:', this.activeIndex);
  }
}

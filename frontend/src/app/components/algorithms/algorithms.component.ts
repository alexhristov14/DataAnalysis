import { Component, ElementRef, ViewChild } from '@angular/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { SharedDataService } from '../../services/api-handler/shared-data.service';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { IftaLabelModule } from 'primeng/iftalabel';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { CommonModule, NgStyle } from '@angular/common';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { TreeNode } from 'primeng/api';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-algorithms',
  templateUrl: './algorithms.component.html',
  styleUrls: ['./algorithms.component.scss'],
  imports: [
    MultiSelectModule,
    FormsModule,
    SelectModule,
    IftaLabelModule,
    TableModule,
    CardModule,
    CommonModule,
    OrganizationChartModule,
  ],
})
export class AlgorithmsComponent {
  featureDataKeys: string[] | null = [];

  selectionAlgorithm!: TreeNode;
  selectedFeature!: string;
  filename: string = 'train.csv';

  algorithms: TreeNode[] = [
    {
      label: 'Algorithms',
      expanded: true,
      children: [
        {
          label: 'Regression',
          expanded: true,
          children: [
            {
              label: 'Linear Regression',
            },
            {
              label: 'Decision Tree Regression',
            },
          ],
        },
        {
          label: 'Classification',
          expanded: true,
          children: [
            {
              label: 'Logistic Regression (Binary)',
            },
            {
              label: 'Decision Tree Classification',
            },
          ],
        },
      ],
    },
  ];

  constructor(private SDS: SharedDataService<File>, private http: HttpClient) {
    this.featureDataKeys = this.SDS.getFeatureData();
    this.filename = this.SDS.getData()!.name;
  }

  onFeatureClick(feature: string): void {
    this.selectedFeature = feature;
    this.runAlgorithm('linear', this.selectedFeature);
  }

  runAlgorithm(algo: string, label: string): void {
    const params = new HttpParams().set('algorithm', algo).set('label', label);

    this.http
      .get<any>(`http://localhost:8000/run_algo/${this.filename}`, { params })
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (err) => console.error('Unique values error', err),
      });
  }
}

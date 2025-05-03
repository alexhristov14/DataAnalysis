import { Component } from '@angular/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { SharedDataService } from '../../services/api-handler/shared-data.service';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { IftaLabelModule } from 'primeng/iftalabel';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { TreeNode } from 'primeng/api';

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

  constructor(private SDS: SharedDataService<File>) {
    this.featureDataKeys = this.SDS.getFeatureData();
  }

  onFeatureClick(feature: string): void {}
}

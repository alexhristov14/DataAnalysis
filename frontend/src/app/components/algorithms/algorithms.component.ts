import { Component } from '@angular/core';
import { SharedDataService } from '../../services/api-handler/shared-data.service';
import { HttpClient } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-algorithms',
  templateUrl: './algorithms.component.html',
  styleUrls: ['./algorithms.component.scss'],
  imports: [
    CardModule,
    CommonModule,
    CascadeSelectModule,
    FormsModule,
    SelectModule,
  ],
})
export class AlgorithmsComponent {
  selectedAlgorithm: any;
  allAlgorithms: any[] = [
    {
      type: 'Regression',
      algorithms: [
        { algo_name: 'Linear Regression' },
        { algo_name: 'Decision Tree' },
      ],
    },
    {
      type: 'Classification',
      algorithms: [{ algo_name: 'Decision Tree' }, { algo_name: 'KNN' }],
    },
  ];

  selectedFeature: any;
  features: any;

  constructor(
    private SDS: SharedDataService<File>,
    private http: HttpClient,
    private router: Router
  ) {
    this.features = this.SDS.getFeatureData();
    if (!this.features) this.router.navigate(['/home']);

    this.selectedFeature = this.features[0];
  }
}

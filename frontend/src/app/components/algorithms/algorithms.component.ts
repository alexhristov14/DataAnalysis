import { Component } from '@angular/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { SharedDataService } from '../../services/api-handler/shared-data.service';
import { FormsModule } from '@angular/forms';
import { RadioButton } from 'primeng/radiobutton';

@Component({
  selector: 'app-algorithms',
  templateUrl: './algorithms.component.html',
  styleUrls: ['./algorithms.component.scss'],
  imports: [MultiSelectModule, FormsModule, RadioButton],
})
export class AlgorithmsComponent {
  featureDataKeys: string[] | null = [];
  selectVariables: string[] | null = [];
  selectedLabel: string | null = null;
  algorithm_category: string = '';

  constructor(private SDS: SharedDataService<File>) {
    this.featureDataKeys = this.SDS.getFeatureData();
  }
}

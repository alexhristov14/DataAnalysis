import { Component } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],
  imports: [ChartComponent],
})
export class AnalysisComponent {
  createChart(): void {}
}

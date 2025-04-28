import { Component, ViewContainerRef, ViewChild } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { SharedDataService } from '../../services/api-handler/shared-data.service';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss'],
  imports: [ChartComponent],
})
export class AnalysisComponent {
  @ViewChild('chartContainer', { read: ViewContainerRef })
  chartContainer!: ViewContainerRef;

  constructor(private SDS: SharedDataService<File>) {}

  ngAfterViewInit(): void {
    this.SDS.data$.subscribe((data) => {
      if (data) {
        this.createChart();
      }
    });
  }

  createChart(): void {
    this.chartContainer.clear();

    const chartRef = this.chartContainer.createComponent(ChartComponent);

    chartRef.setInput('inputType', 'line');
    chartRef.setInput('inputData', [10, 20, 30, 25, 41, 38, 50]);
    chartRef.setInput('inputTitle', 'Sales Over Time');
    chartRef.setInput('inputLabels', [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
    ]);
  }
}

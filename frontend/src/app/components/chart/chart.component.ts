import { Component } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  imports: [BaseChartDirective],
})
export class ChartComponent {
  // Chart options
  options: ChartOptions = {
    responsive: true,
  };

  // Chart labels
  labels: string[] = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];

  // Chart type
  type: ChartType = 'bar';

  // Chart data
  data: ChartData<'bar'> = {
    labels: this.labels,
    datasets: [
      {
        label: 'Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: ['red', 'blue', 'yellow', 'green', 'purple', 'orange'],
      },
    ],
  };
}

import { Component, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  imports: [BaseChartDirective],
})
export class ChartComponent {
  @Input() inputLabels: string[] = ['Label 1', 'Label 2', 'Label 3'];
  @Input() inputData: number[] = [10, 20, 30];
  @Input() inputColors: string[] = ['#FF6384', '#36A2EB', '#FFCE56'];
  @Input() inputType: string = 'bar';
  @Input() inputTitle: string = 'Main Title';

  type: ChartType = this.inputType as ChartType;
  options: ChartOptions = {
    responsive: true,
  };

  data: ChartData<'line'> = {
    labels: this.inputLabels,
    datasets: [
      {
        label: this.inputTitle,
        data: this.inputData,
        backgroundColor: this.inputColors,
      },
    ],
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inputLabels']) {
      this.data.labels = changes['inputLabels'].currentValue;
    }
    if (changes['inputData']) {
      this.data.datasets[0].data = changes['inputData'].currentValue;
    }
    if (changes['inputColors']) {
      this.data.datasets[0].backgroundColor =
        changes['inputColors'].currentValue;
    }
    if (changes['inputType']) {
      this.type = changes['inputType'].currentValue as ChartType;
      this.data.datasets[0].tension = 0.4;
    }
    if (changes['inputTitle']) {
      this.data.datasets[0].label = changes['inputTitle'].currentValue;
    }
  }

  private updateChartData(): void {
    this.data = {
      labels: this.inputLabels,
      datasets: [
        {
          label: this.inputTitle,
          data: this.inputData,
          backgroundColor: this.inputColors,
        },
      ],
    };
  }
}

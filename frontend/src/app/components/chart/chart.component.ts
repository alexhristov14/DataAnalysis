import { Component, Input, SimpleChanges } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  standalone: true,
  imports: [BaseChartDirective],
})
export class ChartComponent {
  @Input() inputType: ChartType = 'bar';
  @Input() inputLabels: string[] = [];
  @Input() inputData: number[] = [];
  @Input() inputColors: string[] = [];
  @Input() inputTitle: string = '';
  @Input() inputOptions: ChartOptions = { responsive: true };
  @Input() inputXLabel: string = 'X-Axis';
  @Input() inputYLabel: string = 'Y-Axis';

  type: ChartType = 'bar';
  data!: ChartData;
  options!: ChartOptions;

  ngOnChanges(changes: SimpleChanges): void {
    this.updateChart();
  }

  private updateChart() {
    this.type = this.inputType;
    this.options = this.inputOptions;

    this.data = {
      labels: this.inputLabels.length ? this.inputLabels : undefined,
      datasets: [
        {
          label: this.inputTitle || 'My Chart',
          data: this.inputData,
          backgroundColor: this.inputColors.length
            ? this.inputColors
            : ['#FF6384', '#36A2EB', '#FFCE56'],
          tension: this.inputType === 'line' ? 0.4 : undefined,
          borderColor:
            this.inputType === 'line'
              ? this.inputColors.length
                ? this.inputColors
                : ['#36A2EB']
              : undefined,
          fill: this.inputType === 'line' ? false : undefined,
        },
      ],
    };
  }
}

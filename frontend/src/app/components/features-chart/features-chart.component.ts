import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { SharedDataService } from '../../services/api-handler/shared-data.service';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';

interface ChartData {
  data: Object;
  options: Object;
}

@Component({
  selector: 'app-features-chart',
  templateUrl: './features-chart.component.html',
  imports: [CardModule, AccordionModule, ChartModule, CommonModule],
})
export class FeaturesChartComponent implements OnInit {
  @Input() selectedFeature: string = '';

  allChartsData: ChartData[] = [];
  chartData: any;
  missingChartData: any;
  chartOptions: any;

  constructor(private http: HttpClient, private SDS: SharedDataService<File>) {}

  ngOnInit(): void {
    this.updateChartData();
  }

  private updateChartData(): void {
    const filename = this.SDS.getFileMetadata()!.name;

    this.SDS.getUniqueFeatureData(filename, this.selectedFeature).subscribe({
      next: (res) => {
        const data = res.result.count;
        this.chartData = this.prepareChart(data);
        if (this.allChartsData.length <= 2) {
          this.allChartsData.push({
            data: this.chartData,
            options: this.chartOptions,
          });
        } else {
          this.allChartsData[0]['data'] = this.chartData;
          this.allChartsData[0]['options'] = this.chartOptions;
        }
      },
      error: (err) => console.error('Unique values error', err),
    });
    this.SDS.getMissingFeatureData(filename, this.selectedFeature).subscribe({
      next: (res) => {
        this.missingChartData = this.prepareChart(res.result);
        if (this.allChartsData.length <= 2) {
          this.allChartsData.push({
            data: this.missingChartData,
            options: this.chartOptions,
          });
        } else {
          this.allChartsData[1]['data'] = this.chartData;
          this.allChartsData[1]['options'] = this.chartOptions;
        }
      },
      error: (err) => console.error('Missing values error', err),
    });
  }

  private prepareChart(data: Record<string, any>): any {
    const labels = Object.keys(data);
    const values = Object.values(data);
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--p-text-muted-color'
    );

    const chart = {
      labels,
      datasets: [{ data: values }],
    };

    const options =
      labels.length <= 5
        ? {
            plugins: {
              legend: {
                display: false,
              },
            },
          }
        : {
            indexAxis: 'y',
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
              legend: {
                labels: { color: textColor },
              },
            },
            scales: {
              x: {
                ticks: { color: textColorSecondary },
                grid: { drawBorder: false },
              },
              y: {
                ticks: { color: textColorSecondary },
                grid: { drawBorder: false },
              },
            },
          };

    this.chartOptions = options;
    return chart;
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { SharedDataService } from '../../services/api-handler/shared-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-correlation-matrix',
  templateUrl: './correlation-matrix.component.html',
  imports: [TableModule, CardModule, CommonModule],
})
export class CorrelationMatrixComponent implements OnInit {
  corrMatrix: number[][] = [];
  corrMatrixFeatures: string[] = [];

  constructor(private http: HttpClient, private SDS: SharedDataService<File>) {}

  ngOnInit(): void {
    this.SDS.data$.subscribe((data) => {
      if (data) {
        const filename = data.name;
        this.getCorrelationMatrix(filename);
      }
    });
  }

  correlationToColor(correlation: number): string {
    const clamped = Math.max(-1, Math.min(1, correlation));

    const NEGATIVE_COLOR = { r: 102, g: 31, b: 43 }; // Dark red
    const ZERO_COLOR = { r: 45, g: 45, b: 45 }; // Same theming
    const POSITIVE_COLOR = { r: 31, g: 77, b: 46 }; // Dark green

    let r, g, b;

    if (clamped < 0) {
      const t = clamped + 1; // [-1, 0] → [0, 1]
      r = Math.round(NEGATIVE_COLOR.r * (1 - t) + ZERO_COLOR.r * t);
      g = Math.round(NEGATIVE_COLOR.g * (1 - t) + ZERO_COLOR.g * t);
      b = Math.round(NEGATIVE_COLOR.b * (1 - t) + ZERO_COLOR.b * t);
    } else {
      const t = clamped; // [0, 1]
      r = Math.round(ZERO_COLOR.r * (1 - t) + POSITIVE_COLOR.r * t);
      g = Math.round(ZERO_COLOR.g * (1 - t) + POSITIVE_COLOR.g * t);
      b = Math.round(ZERO_COLOR.b * (1 - t) + POSITIVE_COLOR.b * t);
    }

    return `rgb(${r}, ${g}, ${b})`;
  }

  private getCorrelationMatrix(filename: string): void {
    this.http
      .get<any>(`http://localhost:8000/api/uploads/${filename}`)
      .subscribe({
        next: (res) => {
          for (let i = 0; i < res.correlation.length; i++) {
            this.corrMatrix.push(
              Object.values(res.correlation[i]).splice(1) as number[]
            );
            this.corrMatrixFeatures.push(res.correlation[i]['Feature']);
          }
        },
        error: (err) => console.error('Feature list error', err),
      });
  }
}

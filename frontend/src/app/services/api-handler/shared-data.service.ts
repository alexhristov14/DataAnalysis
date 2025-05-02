import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface CSVTableFormat {
  name: string;
  columns: string[];
  rows: any[];
}

@Injectable({ providedIn: 'root' })
export class SharedDataService<T> {
  private dataSubject = new BehaviorSubject<T | null>(null);
  data$ = this.dataSubject.asObservable();

  private formattedData = new BehaviorSubject<T | null>(null);
  formattedData$ = this.formattedData.asObservable();

  private featureData = new BehaviorSubject<string[] | null>(null);
  featureData$ = this.featureData.asObservable();

  private table: CSVTableFormat | null = null;

  setData(data: T): void {
    this.dataSubject.next(data);
  }

  getData(): T | null {
    return this.dataSubject.getValue();
  }

  setFeatureData(data: string[]) {
    this.featureData.next(data);
  }

  getFeatureData(): string[] | null {
    return this.featureData.getValue();
  }

  getFormattedData(): CSVTableFormat | null {
    const reader = new FileReader();
    this.data$.subscribe((data) => {
      if (data instanceof File) {
        reader.onload = (e) => {
          const csvData = (e.target?.result as string)
            .split('\n')
            .map((row) => {
              return row.split(',');
            });

          const headers = csvData[0];
          const rows = csvData.slice(1).map((row) => {
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = row[index];
            });
            return obj;
          });

          this.table = {
            name: (data as any).name || 'Unknown',
            columns: headers,
            rows: rows,
          } as CSVTableFormat;
        };
        reader.readAsText(data);
      }
    });

    return this.table;
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

  private featureData = new BehaviorSubject<string[]>([]);
  featureData$ = this.featureData.asObservable();

  private table: CSVTableFormat | null = null;

  constructor(private http: HttpClient) {}

  setFileMetadata(data: T): void {
    this.dataSubject.next(data);
  }

  getFileMetadata(): T | null {
    return this.dataSubject.getValue();
  }

  setFeatureData(data: string[]) {
    this.featureData.next(data);
  }

  getFeatureData(filename: string): Observable<string[]> {
    if (this.featureData) return of(this.featureData.getValue());

    return this.http
      .get<any>(`http://localhost:8000/api/uploads/${filename}`)
      .pipe(
        tap((res) => this.setFeatureData(res.features)),
        map((res) => res.features)
      );
  }

  getUniqueFeatureData(
    filename: string,
    selectedFeature: string
  ): Observable<any> {
    const base = `http://localhost:8000/api/feature_data/${filename}/${selectedFeature}`;
    return this.http.get<any>(`${base}/unique`);
  }

  getMissingFeatureData(
    filename: string,
    selectedFeature: string
  ): Observable<any> {
    const base = `http://localhost:8000/api/feature_data/${filename}/${selectedFeature}`;
    return this.http.get<any>(`${base}/missing`);
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

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

  setData(data: T): void {
    this.dataSubject.next(data);
  }

  getData(): T | null {
    return this.dataSubject.getValue();
  }
}

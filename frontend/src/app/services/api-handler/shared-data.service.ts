import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedDataService<T> {
  private dataSubject = new BehaviorSubject<T | null>(null);
  data$ = this.dataSubject.asObservable();

  setData(data: T) {
    this.dataSubject.next(data);
  }

  getData() {
    return this.dataSubject.getValue();
  }
}

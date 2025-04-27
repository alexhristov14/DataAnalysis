import { Component } from '@angular/core';
import { SheetShowComponent } from '../sheet-show/sheet-show.component';
import { CommonModule } from '@angular/common';
import { FileUploaderComponent } from '../file-uploader/file-uploader.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, FileUploaderComponent, SheetShowComponent],
  standalone: true,
})
export class HomeComponent {
  uploadedFiles: File[] = [];

  constructor(private http: HttpClient) {}

  receiveDataFromPost(endpoint: string, payload: any): void {
    this.http.post(endpoint, payload).subscribe({
      next: (response) => {
        console.log('Data received:', response);
      },
      error: (error) => {
        console.error('Error occurred:', error);
      },
    });
  }
}

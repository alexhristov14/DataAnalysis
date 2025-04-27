import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent {
  selectedFile: File | null = null;
  validTypes: string[] = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  constructor(private http: HttpClient) {}

  onUpload(event: Event) {
    if (!this.selectedFile) return;

    if (!this.validTypes.includes(this.selectedFile.type)) {
      alert('Invalid file type. Please upload a CSV or Excel file.');
      this.selectedFile = null;
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http
      .post('http://localhost:8000/api/upload', formData)
      .subscribe(() => {
        console.log('File uploaded successfully');
      });
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.selectedFile = element.files[0];
    } else {
      this.selectedFile = null;
    }
  }
}

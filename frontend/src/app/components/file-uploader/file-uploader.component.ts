import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { SharedDataService } from '../../services/api-handler/shared-data.service';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  imports: [FileUploadModule, CommonModule],
})
export class FileUploaderComponent {
  uploadedFiles: File[] = [];
  validTypes: string[] = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  constructor(
    private http: HttpClient,
    private sharedDataService: SharedDataService<File>
  ) {}

  onUpload(event: FileUploadHandlerEvent) {
    const files: File[] = event.files;

    for (let file of files) {
      if (!this.validTypes.includes(file.type)) {
        alert('Invalid file type: ' + file.name);
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);

      this.http
        .post('http://localhost:8000/api/upload', formData)
        .subscribe((response) => {
          console.log(`Succefully uploaded: ${Object(response).filename}`);
        });

      this.sharedDataService.setFileMetadata(file);

      this.uploadedFiles.push(file);
    }
  }
}

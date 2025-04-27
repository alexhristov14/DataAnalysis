import { Component } from '@angular/core';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';

@Component({
  selector: 'app-root',
  imports: [FileUploaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}

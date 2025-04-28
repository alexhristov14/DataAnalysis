import { Component } from '@angular/core';
import { DataMenuComponent } from './components/data-menu/data-menu.component';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  imports: [DataMenuComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isDarkMode: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get('http://localhost:8000/api/uploads/train.csv')
      .subscribe((data) => {
        console.log('Data from API:', data);
      });
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    if (element) {
      if (this.isDarkMode) {
        element.classList.remove('dark-mode');
      } else {
        element.classList.add('dark-mode');
      }
      this.isDarkMode = !this.isDarkMode;
    }
  }
}

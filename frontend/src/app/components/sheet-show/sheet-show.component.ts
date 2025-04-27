import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { SharedDataService } from '../../services/api-handler/shared-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sheet-show',
  templateUrl: './sheet-show.component.html',
  styleUrls: ['./sheet-show.component.scss'],
  imports: [TableModule, CommonModule],
})
export class SheetShowComponent implements OnInit {
  uploadedFiles: File[] = [];
  tables: any[] = [];

  //   products: any[] = [
  //     { id: 1, name: 'Product 1', price: 10.0, quantity: 5 },
  //     { id: 2, name: 'Product 2', price: 20.0, quantity: 3 },
  //     { id: 3, name: 'Product 3', price: 15.0, quantity: 8 },
  //     { id: 4, name: 'Product 4', price: 30.0, quantity: 2 },
  //     { id: 5, name: 'Product 5', price: 25.0, quantity: 6 },
  //     { id: 6, name: 'Product 6', price: 12.0, quantity: 4 },
  //     { id: 7, name: 'Product 7', price: 18.0, quantity: 7 },
  //     { id: 8, name: 'Product 8', price: 22.0, quantity: 1 },
  //     { id: 9, name: 'Product 9', price: 14.0, quantity: 9 },
  //     { id: 10, name: 'Product 10', price: 28.0, quantity: 3 },
  //   ];
  constructor(private sharedDataService: SharedDataService<File>) {}

  ngOnInit(): void {
    this.sharedDataService.data$.subscribe((data) => {
      if (data) {
        console.log('Received data from file uploader:', data);
        this.uploadedFiles.push(data);
        this.renderTable(data);
      }
    });
  }

  renderTable(data: File): void {
    console.log('Rendering table for file:', data.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvData = (e.target?.result as string).split('\n').map((row) => {
        return row.split(',');
      });
      console.log('CSV Data:', csvData);

      // Assuming the first row contains headers
      const headers = csvData[0];
      const rows = csvData.slice(1).map((row) => {
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      });

      this.tables.push({ name: data.name, data: rows });
    };
    reader.readAsText(data);
    console.log(this.tables);
  }
}

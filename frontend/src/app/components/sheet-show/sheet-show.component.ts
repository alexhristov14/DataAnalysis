import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TableModule } from 'primeng/table';
import { SharedDataService } from '../../services/api-handler/shared-data.service';
import { CommonModule } from '@angular/common';

interface CSVTableFormat {
  name: string;
  columns: string[];
  rows: any[];
}

@Component({
  selector: 'app-sheet-show',
  templateUrl: './sheet-show.component.html',
  styleUrls: ['./sheet-show.component.scss'],
  imports: [TableModule, CommonModule],
})
export class SheetShowComponent implements OnInit {
  uploadedFiles: Set<string> = new Set();
  // tables: CSVTableFormat[] = [];
  table: CSVTableFormat | null = null;

  constructor(private sharedDataService: SharedDataService<File>) {}

  ngOnInit(): void {
    this.sharedDataService.data$.subscribe((data) => {
      if (data && !this.uploadedFiles.has(data.name)) {
        this.uploadedFiles.add(data.name);
        this.renderTable(data);
      }
    });
  }

  renderTable(data: File): void {
    if (!data || !data.name.endsWith('.csv') || !data.size) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvData = (e.target?.result as string).split('\n').map((row) => {
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
        name: data.name,
        columns: headers,
        rows: rows,
      } as CSVTableFormat;
    };
    reader.readAsText(data);
  }
}

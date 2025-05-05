import { Component, OnInit } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  CdkDragEnd,
  CdkDragDrop,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { SharedDataService } from '../../services/api-handler/shared-data.service';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
let id = 0;
let algo_id = 0;
interface Card {
  id: number;
  content: string;
  x: number;
  y: number;
}

interface Zone {
  label: string;
  id: string;
  items: any[];
}

@Component({
  selector: 'app-algorithms',
  templateUrl: './algorithms.component.html',
  styleUrls: ['./algorithms.component.scss'],
  imports: [DragDropModule, CardModule, CommonModule],
})
export class AlgorithmsComponent implements OnInit {
  features: string[] | null = [];
  cards: Card[] = [];

  algorithms: string[] = ['Linear Regression', 'KNN'];
  algorithms_cards: Card[] = [];

  scalers: string[] = ['MinMax', 'Normalizer', 'StandardScaler'];

  zones: Zone[] = [
    { label: 'Input', id: 'input', items: [] },
    { label: 'Scaler', id: 'scaler', items: [] },
    { label: 'ML Algorithm', id: 'ml', items: [] },
    { label: 'Output', id: 'output', items: [] },
  ];

  constructor(private SDS: SharedDataService<File>) {
    this.features = this.SDS.getFeatureData();
  }

  ngOnInit(): void {
    this.features?.forEach((feature) => {
      this.cards.push({
        id: id++,
        content: feature,
        x: 5,
        y: 5,
      });
    });

    this.algorithms.forEach((algo) => {
      this.algorithms_cards.push({
        id: algo_id++,
        content: algo,
        x: 5,
        y: 5,
      });
    });
  }

  onDrop(event: CdkDragDrop<any[]>, zone: Zone) {
    if (event.previousContainer !== event.container) {
      const item = event.previousContainer.data[event.previousIndex];

      const copiedItem = { ...item };
      zone.items.splice(event.currentIndex, 0, copiedItem);

      event.previousContainer.data.splice(event.previousIndex, 1);
    }
  }

  onDragEnd(event: CdkDragEnd, card: any) {
    const transform = event.source.getFreeDragPosition();
    card.x = transform.x;
    card.y = transform.y;
  }

  get connectedDropLists() {
    return this.zones.map((zone) => zone.id);
  }
}

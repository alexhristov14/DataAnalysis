import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-data-menu',
  templateUrl: './data-menu.component.html',
  styleUrls: ['./data-menu.component.scss'],
  imports: [MenubarModule, CommonModule],
})
export class DataMenuComponent {
  activeComponent: string = 'Import';

  items: MenuItem[] = [
    {
      label: 'Home',
      routerLink: '/home',
    },
    {
      label: 'Results',
      icon: 'pi pi-fw pi-chart-line',
      routerLink: '/results',
      items: [
        {
          label: 'Analysis',
          routerLink: '/results/analysis',
        },
        {
          label: 'Algorithms',
          routerLink: '/results/algorithms',
        },
      ],
    },
    {
      label: 'Settings',
      routerLink: '/settings',
    },
  ];

  onFocus(event: Event) {
    console.log('onFocus', event.target);
  }
}

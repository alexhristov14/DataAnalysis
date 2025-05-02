import { Routes } from '@angular/router';
import { ChartComponent } from './components/chart/chart.component';
import { HomeComponent } from './components/home/home.component';
import { AnalysisComponent } from './components/analysis/analysis.component';
import { AlgorithmsComponent } from './components/algorithms/algorithms.component';
import { SettingsComponent } from './components/settings/settings.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'algorithms', component: AlgorithmsComponent },
  { path: 'settings', component: SettingsComponent },
];

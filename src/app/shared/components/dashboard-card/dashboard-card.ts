import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  imports: [],
  templateUrl: './dashboard-card.html',
  styleUrl: './dashboard-card.scss',
})
export class DashboardCard {
  label = input.required<string>();
  value = input.required<string | number>();
  icon = input('🏨');
  accent = input<'gold' | 'teal' | 'navy' | 'danger'>('gold');
}

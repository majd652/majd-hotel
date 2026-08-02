import { Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { APP_NAME } from '../../utils/app-constants';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles?: ('admin' | 'manager')[];
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private auth = inject(AuthService);
  readonly appName = APP_NAME;

  open = input(false);
  linkClicked = output<void>();
  backdropClicked = output<void>();

  private allItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Hotels', path: '/hotels', icon: '🏨', roles: ['admin'] },
    { label: 'Rooms', path: '/rooms', icon: '🛏️', roles: ['admin'] },
    { label: 'New Booking', path: '/bookings', icon: '📝' },
    { label: 'Booking History', path: '/bookings/history', icon: '📖' },
  ];

  get visibleItems(): NavItem[] {
    const role = this.auth.currentUser()?.role;
    return this.allItems.filter((item) => !item.roles || (role && item.roles.includes(role)));
  }
}

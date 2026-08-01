import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest-guard';
import { authGuard } from './core/guards/auth-guard';
export const routes: Routes = [
    {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'hotels',
        loadComponent: () => import('./pages/hotels/hotels').then((m) => m.Hotels),
      },
      {
        path: 'rooms',
        loadComponent: () => import('./pages/rooms/rooms').then((m) => m.Rooms),
      },
      {
        path: 'bookings',
        loadComponent: () => import('./pages/bookings/bookings').then((m) => m.Bookings),
      },
      {
        path: 'bookings/history',
        loadComponent: () =>
          import('./pages/booking-history/booking-history').then((m) => m.BookingHistory),
      },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
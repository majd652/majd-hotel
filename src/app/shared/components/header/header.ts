import { Component, inject, output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  auth = inject(AuthService);
  private router = inject(Router);

  menuToggle = output<void>();

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
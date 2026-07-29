import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast';

@Component({
  selector: 'app-toast-container',
  imports: [],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.scss',
})
export class ToastContainer {
  toastService = inject(ToastService);
}

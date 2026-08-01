import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const message = err.status === 0
        ? 'Cannot reach the server. Is the mock API running?'
        : err.error?.message || 'Something went wrong. Please try again.';
      toast.error(message);
      return throwError(() => err);
    }),
  );
};
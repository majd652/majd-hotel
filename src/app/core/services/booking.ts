import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking, BookingFormValue, BookingStatus } from '../../models/booking.model';
import { calculateBookingSummary } from '../../shared/utils/booking-calculator';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/bookings`;

  getAll(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.baseUrl);
  }

  create(payload: BookingFormValue, pricePerNight: number): Observable<Booking> {
    const summary = calculateBookingSummary(payload.checkIn, payload.checkOut, pricePerNight, payload.discountPercent);

    const body = {
      ...payload,
      nights: summary.nights,
      pricePerNight,
      taxAmount: summary.tax,
      totalAmount: summary.total,
      status: 'Pending' as BookingStatus,
      createdAt: new Date().toISOString(),
    };
    return this.http.post<Booking>(this.baseUrl, body);
  }

  updateStatus(id: number, status: BookingStatus): Observable<Booking> {
    return this.http.patch<Booking>(`${this.baseUrl}/${id}`, { status });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
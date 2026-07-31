import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking, BookingFormValue, BookingStatus } from '../../models/booking.model';

const TAX_RATE = 0.1;

@Injectable({ providedIn: 'root' })
export class BookingService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/bookings`;

  getAll(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.baseUrl);
  }

  create(payload: BookingFormValue, pricePerNight: number): Observable<Booking> {
    const nights = this.calculateNights(payload.checkIn, payload.checkOut);
    const subtotal = nights * pricePerNight;
    const tax = subtotal * TAX_RATE;
    const discount = (subtotal * payload.discountPercent) / 100;
    const total = Math.max(subtotal + tax - discount, 0);

    const body = {
      ...payload,
      nights,
      pricePerNight,
      taxAmount: Math.round(tax * 100) / 100,
      totalAmount: Math.round(total * 100) / 100,
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

  private calculateNights(checkIn: string, checkOut: string): number {
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();
    if (isNaN(start) || isNaN(end) || end <= start) return 0;
    return Math.round((end - start) / (1000 * 60 * 60 * 24));
  }
}

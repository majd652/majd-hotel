import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Hotel, HotelFormValue } from '../../models/hotel.model';

@Injectable({ providedIn: 'root' })
export class HotelService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/hotels`;

  getAll(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.baseUrl);
  }

  create(payload: HotelFormValue): Observable<Hotel> {
    const body = { ...payload, createdAt: new Date().toISOString() };
    return this.http.post<Hotel>(this.baseUrl, body);
  }

  update(id: number, payload: HotelFormValue): Observable<Hotel> {
    return this.http.patch<Hotel>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

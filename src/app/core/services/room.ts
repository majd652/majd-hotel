import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Room, RoomFormValue } from '../../models/room.model';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/rooms`;

  getAll(): Observable<Room[]> {
    return this.http.get<Room[]>(this.baseUrl);
  }

  getByHotel(hotelId: number): Observable<Room[]> {
    return this.http.get<Room[]>(this.baseUrl, { params: { hotelId } });
  }

  create(payload: RoomFormValue): Observable<Room> {
    return this.http.post<Room>(this.baseUrl, payload);
  }

  update(id: number, payload: RoomFormValue): Observable<Room> {
    return this.http.patch<Room>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
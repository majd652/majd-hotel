import { Component, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { HotelService } from '../../core/services/hotel';
import { RoomService } from '../../core/services/room';
import { BookingService } from '../../core/services/booking';
import { AuthService } from '../../core/services/auth';
import { DashboardCard } from '../../shared/components/dashboard-card/dashboard-card';
import { Loader } from '../../shared/components/loader/loader';
import { Hotel } from '../../models/hotel.model';
import { Room } from '../../models/room.model';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardCard, Loader],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private hotelService = inject(HotelService);
  private roomService = inject(RoomService);
  private bookingService = inject(BookingService);
  auth = inject(AuthService);

  loading = signal(true);
  hotels = signal<Hotel[]>([]);
  rooms = signal<Room[]>([]);
  bookings = signal<Booking[]>([]);

  availableRooms = computed(() => this.rooms().filter((r) => r.available).length);
  totalRevenue = computed(() =>
    this.bookings()
      .filter((b) => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + b.totalAmount, 0),
  );

  constructor() {
    forkJoin({
      hotels: this.hotelService.getAll(),
      rooms: this.roomService.getAll(),
      bookings: this.bookingService.getAll(),
    }).subscribe({
      next: (res) => {
        this.hotels.set(res.hotels);
        this.rooms.set(res.rooms);
        this.bookings.set(res.bookings);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { BookingService } from '../../core/services/booking';
import { HotelService } from '../../core/services/hotel';
import { RoomService } from '../../core/services/room';
import { Booking, BookingStatus } from '../../models/booking.model';
import { Hotel } from '../../models/hotel.model';
import { Room } from '../../models/room.model';
import { DataTable, TableColumn } from '../../shared/components/data-table/data-table';
import { Search } from '../../shared/components/search/search';
import { Dropdown, SelectOption } from '../../shared/components/dropdown/dropdown';
import { Pagination } from '../../shared/components/pagination/pagination';

interface BookingRow {
  id: number;
  customerName: string;
  hotelName: string;
  roomNumber: string;
  dates: string;
  status: BookingStatus;
  totalAmount: string;
}

const PAGE_SIZE = 5;

@Component({
  selector: 'app-booking-history',
  imports: [DataTable, Search, Dropdown, Pagination],
  templateUrl: './booking-history.html',
  styleUrl: './booking-history.scss',
})
export class BookingHistory {
  private bookingService = inject(BookingService);
  private hotelService = inject(HotelService);
  private roomService = inject(RoomService);

  loading = signal(true);
  bookings = signal<Booking[]>([]);
  hotels = signal<Hotel[]>([]);
  rooms = signal<Room[]>([]);

  searchTerm = signal('');
  statusFilter = signal<string | number | null>(null);
  currentPage = signal(1);

  readonly statusOptions: SelectOption[] = [
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  columns: TableColumn<BookingRow>[] = [
    { key: 'id', header: 'Booking ID', sortable: true },
    { key: 'customerName', header: 'Customer', sortable: true },
    { key: 'hotelName', header: 'Hotel', sortable: true },
    { key: 'roomNumber', header: 'Room', sortable: true },
    { key: 'dates', header: 'Dates', sortable: false },
    { key: 'status', header: 'Status', sortable: true },
    { key: 'totalAmount', header: 'Total', sortable: true },
  ];

  private rows = computed<BookingRow[]>(() => {
    const hotelMap = new Map(this.hotels().map((h) => [h.id, h.name]));
    const roomMap = new Map(this.rooms().map((r) => [r.id, r.roomNumber]));
    return this.bookings().map((b) => ({
      id: b.id,
      customerName: b.customerName,
      hotelName: hotelMap.get(b.hotelId) ?? 'Unknown',
      roomNumber: roomMap.get(b.roomId) ?? '-',
      dates: `${b.checkIn} → ${b.checkOut}`,
      status: b.status,
      totalAmount: `€${b.totalAmount.toFixed(2)}`,
    }));
  });

  filteredRows = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const status = this.statusFilter();
    return this.rows().filter((r) => {
      const matchesSearch = !term || r.customerName.toLowerCase().includes(term) || r.hotelName.toLowerCase().includes(term);
      const matchesStatus = !status || r.status === status;
      return matchesSearch && matchesStatus;
    });
  });

  pageSize = PAGE_SIZE;

  pagedRows = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.filteredRows().slice(start, start + PAGE_SIZE);
  });

  constructor() {
    this.bookingService.getAll().subscribe({
      next: (b) => { this.bookings.set(b); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
    this.hotelService.getAll().subscribe({ next: (h) => this.hotels.set(h) });
    this.roomService.getAll().subscribe({ next: (r) => this.rooms.set(r) });
  }
}

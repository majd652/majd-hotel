import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoomService } from '../../core/services/room';
import { HotelService } from '../../core/services/hotel';
import { ToastService } from '../../core/services/toast';
import { Room, RoomFormValue, RoomType } from '../../models/room.model';
import { Hotel } from '../../models/hotel.model';
import { DataTable, TableColumn } from '../../shared/components/data-table/data-table';
import { Modal } from '../../shared/components/modal/modal';
import { Input } from '../../shared/components/input/input';
import { Dropdown, SelectOption } from '../../shared/components/dropdown/dropdown';
import { Button } from '../../shared/components/button/button';
import { Search } from '../../shared/components/search/search';

interface RoomRow extends Room {
  hotelName: string;
}

@Component({
  selector: 'app-rooms',
  imports: [FormsModule, ReactiveFormsModule, DataTable, Modal, Input, Dropdown, Button, Search],
  templateUrl: './rooms.html',
  styleUrl: './rooms.scss',
})
export class Rooms {
  private fb = inject(FormBuilder);
  private roomService = inject(RoomService);
  private hotelService = inject(HotelService);
  private toast = inject(ToastService);

  loading = signal(true);
  rooms = signal<Room[]>([]);
  hotels = signal<Hotel[]>([]);
  searchTerm = signal('');

  formModalOpen = signal(false);
  confirmModalOpen = signal(false);
  editingId = signal<number | null>(null);
  roomToDelete = signal<Room | null>(null);
  saving = signal(false);

  readonly typeOptions: SelectOption[] = ['Single', 'Double', 'Suite', 'Deluxe', 'Family']
    .map((t) => ({ label: t, value: t }));

  hotelOptions = computed<SelectOption[]>(() =>
    this.hotels().map((h) => ({ label: h.name, value: h.id })),
  );

  columns: TableColumn<RoomRow>[] = [
    { key: 'roomNumber', header: 'Room No.', sortable: true },
    { key: 'hotelName', header: 'Hotel', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'capacity', header: 'Capacity', sortable: true },
    { key: 'price', header: 'Price/Night', sortable: true },
    { key: 'available', header: 'Available', sortable: true },
  ];

  roomRows = computed<RoomRow[]>(() => {
    const hotelMap = new Map(this.hotels().map((h) => [h.id, h.name]));
    return this.rooms().map((r) => ({ ...r, hotelName: hotelMap.get(r.hotelId) ?? 'Unknown' }));
  });

  filteredRooms = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.roomRows();
    return this.roomRows().filter(
      (r) => r.roomNumber.toLowerCase().includes(term) || r.hotelName.toLowerCase().includes(term),
    );
  });

  form = this.fb.group({
    hotelId: [0, [Validators.required, Validators.min(1)]],
    roomNumber: ['', Validators.required],
    type: ['Single' as RoomType, Validators.required],
    capacity: [1, [Validators.required, Validators.min(1)]],
    price: [50, [Validators.required, Validators.min(1)]],
    available: [true],
  });

  constructor() {
    this.fetchAll();
  }

  fetchAll(): void {
    this.loading.set(true);
    this.hotelService.getAll().subscribe({ next: (h) => this.hotels.set(h) });
    this.roomService.getAll().subscribe({
      next: (r) => { this.rooms.set(r); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  openAddModal(): void {
    this.editingId.set(null);
    this.form.reset({ hotelId: 0, roomNumber: '', type: 'Single', capacity: 1, price: 50, available: true });
    this.formModalOpen.set(true);
  }

  openEditModal(room: Room): void {
    this.editingId.set(room.id);
    this.form.setValue({
      hotelId: room.hotelId, roomNumber: room.roomNumber, type: room.type,
      capacity: room.capacity, price: room.price, available: room.available,
    });
    this.formModalOpen.set(true);
  }

  saveRoom(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const payload = this.form.getRawValue() as RoomFormValue;
    const id = this.editingId();

    const request$ = id ? this.roomService.update(id, payload) : this.roomService.create(payload);
    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.formModalOpen.set(false);
        this.toast.success(id ? 'Room updated.' : 'Room added.');
        this.fetchAll();
      },
      error: () => this.saving.set(false),
    });
  }

  askDelete(room: Room): void {
    this.roomToDelete.set(room);
    this.confirmModalOpen.set(true);
  }

  confirmDelete(): void {
    const room = this.roomToDelete();
    if (!room) return;
    this.roomService.delete(room.id).subscribe({
      next: () => {
        this.confirmModalOpen.set(false);
        this.toast.success('Room deleted.');
        this.fetchAll();
      },
    });
  }
}

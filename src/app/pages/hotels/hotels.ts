import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotelService } from '../../core/services/hotel';
import { ToastService } from '../../core/services/toast';
import { Hotel, HotelFormValue } from '../../models/hotel.model';
import { DataTable, TableColumn } from '../../shared/components/data-table/data-table';
import { Modal } from '../../shared/components/modal/modal';
import { Input } from '../../shared/components/input/input';
import { Button } from '../../shared/components/button/button';
import { Search } from '../../shared/components/search/search';

@Component({
  selector: 'app-hotels',
  imports: [ReactiveFormsModule, DataTable, Modal, Input, Button, Search],
  templateUrl: './hotels.html',
  styleUrl: './hotels.scss',
})
export class Hotels {
  private fb = inject(FormBuilder);
  private hotelService = inject(HotelService);
  private toast = inject(ToastService);

  loading = signal(true);
  hotels = signal<Hotel[]>([]);
  searchTerm = signal('');

  formModalOpen = signal(false);
  confirmModalOpen = signal(false);
  editingId = signal<number | null>(null);
  hotelToDelete = signal<Hotel | null>(null);
  saving = signal(false);

  columns: TableColumn<Hotel>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'city', header: 'City', sortable: true },
    { key: 'rating', header: 'Rating', sortable: true },
    { key: 'totalRooms', header: 'Rooms', sortable: true },
  ];

  filteredHotels = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.hotels();
    return this.hotels().filter(
      (h) => h.name.toLowerCase().includes(term) || h.city.toLowerCase().includes(term),
    );
  });

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    city: ['', Validators.required],
    address: ['', Validators.required],
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    totalRooms: [1, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    this.fetchHotels();
  }

  fetchHotels(): void {
    this.loading.set(true);
    this.hotelService.getAll().subscribe({
      next: (data) => { this.hotels.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  openAddModal(): void {
    this.editingId.set(null);
    this.form.reset({ name: '', city: '', address: '', rating: 5, totalRooms: 1 });
    this.formModalOpen.set(true);
  }

  openEditModal(hotel: Hotel): void {
    this.editingId.set(hotel.id);
    this.form.setValue({
      name: hotel.name, city: hotel.city, address: hotel.address,
      rating: hotel.rating, totalRooms: hotel.totalRooms,
    });
    this.formModalOpen.set(true);
  }

  saveHotel(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const payload = this.form.getRawValue() as HotelFormValue;
    const id = this.editingId();

    const request$ = id ? this.hotelService.update(id, payload) : this.hotelService.create(payload);
    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.formModalOpen.set(false);
        this.toast.success(id ? 'Hotel updated successfully.' : 'Hotel added successfully.');
        this.fetchHotels();
      },
      error: () => this.saving.set(false),
    });
  }

  askDelete(hotel: Hotel): void {
    this.hotelToDelete.set(hotel);
    this.confirmModalOpen.set(true);
  }

  confirmDelete(): void {
    const hotel = this.hotelToDelete();
    if (!hotel) return;
    this.hotelService.delete(hotel.id).subscribe({
      next: () => {
        this.confirmModalOpen.set(false);
        this.toast.success('Hotel deleted.');
        this.fetchHotels();
      },
    });
  }
}

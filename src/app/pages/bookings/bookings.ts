import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { HotelService } from '../../core/services/hotel';
import { RoomService } from '../../core/services/room';
import { BookingService } from '../../core/services/booking';
import { ToastService } from '../../core/services/toast';
import { Hotel } from '../../models/hotel.model';
import { Room } from '../../models/room.model';
import { calculateBookingSummary } from '../../shared/utils/booking-calculator';
import { Input } from '../../shared/components/input/input';
import { Dropdown, SelectOption } from '../../shared/components/dropdown/dropdown';
import { DatePicker } from '../../shared/components/date-picker/date-picker';
import { Button } from '../../shared/components/button/button';

@Component({
  selector: 'app-bookings',
  imports: [ReactiveFormsModule, Input, Dropdown, DatePicker, Button],
  templateUrl: './bookings.html',
  styleUrl: './bookings.scss',
})
export class Bookings {
  private fb = inject(FormBuilder);
  private hotelService = inject(HotelService);
  private roomService = inject(RoomService);
  private bookingService = inject(BookingService);
  private toast = inject(ToastService);

  hotels = signal<Hotel[]>([]);
  rooms = signal<Room[]>([]);
  saving = signal(false);
  today = new Date().toISOString().split('T')[0];

  form = this.fb.group({
    customerName: ['', Validators.required],
    customerEmail: ['', [Validators.required, Validators.email]],
    hotelId: [0, [Validators.required, Validators.min(1)]],
    roomId: [0, [Validators.required, Validators.min(1)]],
    checkIn: ['', Validators.required],
    checkOut: ['', Validators.required],
    discountPercent: [0, [Validators.min(0), Validators.max(100)]],
  });

  private formValue = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  hotelOptions = computed<SelectOption[]>(() => this.hotels().map((h) => ({ label: h.name, value: h.id })));

  availableRoomOptions = computed<SelectOption[]>(() => {
    const hotelId = this.formValue().hotelId;
    return this.rooms()
      .filter((r) => r.hotelId === hotelId && r.available)
      .map((r) => ({ label: `${r.roomNumber} · ${r.type} (€${r.price}/night)`, value: r.id }));
  });

  selectedRoomPrice = computed(() => {
    const roomId = this.formValue().roomId;
    return this.rooms().find((r) => r.id === roomId)?.price ?? 0;
  });

  summary = computed(() => {
    const v = this.formValue();
    return calculateBookingSummary(v.checkIn ?? '', v.checkOut ?? '', this.selectedRoomPrice(), v.discountPercent ?? 0);
  });

  constructor() {
    this.hotelService.getAll().subscribe({ next: (h) => this.hotels.set(h) });
    this.roomService.getAll().subscribe({ next: (r) => this.rooms.set(r) });
  }

  submit(): void {
    if (this.form.invalid || this.summary().nights <= 0) {
      this.form.markAllAsTouched();
      if (this.summary().nights <= 0) this.toast.error('Check-out date must be after check-in date.');
      return;
    }
    this.saving.set(true);
    const { discountPercent, ...rest } = this.form.getRawValue();
    this.bookingService.create({ ...rest, discountPercent: discountPercent ?? 0 } as any, this.selectedRoomPrice()).subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success('Booking created successfully.');
        this.form.reset({ customerName: '', customerEmail: '', hotelId: 0, roomId: 0, checkIn: '', checkOut: '', discountPercent: 0 });
      },
      error: () => this.saving.set(false),
    });
  }
}
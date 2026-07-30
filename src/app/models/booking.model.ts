export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
export interface Booking {
  id: number;
  customerName: string;
  customerEmail: string;
  hotelId: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  pricePerNight: number;
  taxAmount: number;
  discountPercent: number;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
}
export type BookingFormValue = Pick<Booking, 'customerName' | 'customerEmail' | 'hotelId' | 'roomId' | 'checkIn' | 'checkOut' | 'discountPercent'>;
export interface BookingSummary {
  nights: number;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}
export interface Hotel {
  id: number;
  name: string;
  city: string;
  address: string;
  rating: number;
  totalRooms: number;
  imageUrl?: string;
  createdAt: string;
}
export type HotelFormValue = Omit<Hotel, 'id' | 'createdAt'>;
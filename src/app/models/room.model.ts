export type RoomType = 'Single' | 'Double' | 'Suite' | 'Deluxe' | 'Family';
export interface Room {
  id: number;
  hotelId: number;
  roomNumber: string;
  type: RoomType;
  capacity: number;
  price: number;
  available: boolean;
}
export type RoomFormValue = Omit<Room, 'id'>;
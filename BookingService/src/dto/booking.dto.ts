export type CreateBookingDto = {
  userId: number;
  hotelId: number;
  roomCategoryId: number;
  totalGuests: number;
  checkInDate: string;
  checkOutDate: string;
};

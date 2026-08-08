export type CreateBookingDto = {
  userId: number;
  hotelId: number;
  roomCategoryId: number;
  bookingAmount: number;
  totalGuests: number;
  checkInDate: string;
  checkOutDate: string;
};

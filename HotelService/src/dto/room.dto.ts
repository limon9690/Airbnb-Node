export type findByRoomCategoryIdAndDateRangeDTO = {
  roomCategoryId: number;
  startDate: string;
  endDate: string;
};

export type updateBookingIdToRoomsDTO = {
  roomIds: number[];
  bookingId: number;
};

export type releaseRoomsByBookingIdDTO = {
  bookingId: number;
};

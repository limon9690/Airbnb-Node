import { z } from "zod";

export const findByRoomCategoryIdAndDateRangeSchema = z.object({
  roomCategoryId: z.string({ message: "Room category ID must be present" }),
  startDate: z.string({ message: "Start date must be present" }),
  endDate: z.string({ message: "End date must be present" }),
});

export const updateBookingIdToRoomsSchema = z.object({
  roomIds: z.array(z.number().int().positive()),
  bookingId: z.number().int().positive(),
});

export const releaseRoomsByBookingIdSchema = z.object({
  bookingId: z.number().int().positive(),
});

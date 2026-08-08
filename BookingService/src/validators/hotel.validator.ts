import { z } from "zod";

export const createBookingSchema = z
  .object({
    hotelId: z.number({ message: "Hotel ID must be present" }),
    totalGuests: z
      .number({ message: "Total guests must be present" })
      .min(1, { message: "Total guests must be at least 1" }),
    roomCategoryId: z.number({ message: "Room category ID must be present" }),
    checkInDate: z.string({ message: "Check-in date must be present" }),
    checkOutDate: z.string({ message: "Check-out date must be present" }),
  })
  .refine(
    (data) =>
      new Date(data.checkOutDate).getTime() >
      new Date(data.checkInDate).getTime(),
    {
      message: "Check-out date must be after check-in date",
      path: ["checkOutDate"],
    },
  );

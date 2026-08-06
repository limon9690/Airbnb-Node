import { z } from "zod";

export const findByRoomCategoryIdAndDateRangeSchema = z.object({
  roomCategoryId: z.number().int().positive(),
  startDate: z.string({ message: "Start date must be present" }),
  endDate: z.string({ message: "End date must be present" }),
});

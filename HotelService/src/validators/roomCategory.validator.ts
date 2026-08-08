import { z } from "zod";
import { RoomType } from "../../generated/prisma/enums";

export const createRoomCategorySchema = z.object({
  price: z.number({ message: "Price must be present" }).positive(),
  roomType: z.nativeEnum(RoomType, { message: "Room type must be valid" }),
  roomCount: z
    .number({ message: "Room count must be present" })
    .int()
    .positive(),
});

import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../utils/lib/prisma";

const findByRoomCategoryIdAndDate = async (roomCategoryId: number, dateOfAvailability: Date) => {
  return await prisma.room.findFirst({
    where: {
      roomCategoryId,
      dateOfAvailability,
    },
  });
};

const bulkCreate = async (rooms: Prisma.RoomCreateManyInput[]) => {
  return await prisma.room.createMany({
    data: rooms,
  });
};

export const roomRepository = {
  findByRoomCategoryIdAndDate,
  bulkCreate,
};
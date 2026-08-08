import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../utils/lib/prisma";

const findByRoomCategoryIdAndDate = async (
  roomCategoryId: number,
  dateOfAvailability: Date,
) => {
  return await prisma.room.findFirst({
    where: {
      roomCategoryId,
      dateOfAvailability,
    },
  });
};

const countByRoomCategoryIdAndDate = async (
  roomCategoryId: number,
  dateOfAvailability: Date,
) => {
  return await prisma.room.count({
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

const findLatestDateByRoomCategoryId = async (roomCategoryId: number) => {
  const result = await prisma.room.findFirst({
    where: {
      roomCategoryId,
    },
    orderBy: {
      dateOfAvailability: "desc",
    },
    select: {
      dateOfAvailability: true,
    },
  });

  return result?.dateOfAvailability ?? null;
};

const findLatestDatesForAllCategories = async () => {
  const results = await prisma.room.groupBy({
    by: ["roomCategoryId"],
    _max: {
      dateOfAvailability: true,
    },
  });

  return results
    .filter((result) => result._max.dateOfAvailability !== null)
    .map((result) => ({
      roomCategoryId: result.roomCategoryId,
      latestDate: result._max.dateOfAvailability as Date,
    }));
};

const findByRoomCategoryIdAndDateRange = async (
  roomCategoryId: number,
  startDate: Date,
  endDate: Date,
) => {
  return await prisma.room.findMany({
    where: {
      roomCategoryId,
      bookingId: null,
      dateOfAvailability: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      dateOfAvailability: "asc",
    },
  });
};

const updateBookingIdToRooms = async (roomIds: number[], bookingId: number) => {
  return await prisma.room.updateMany({
    where: {
      id: {
        in: roomIds,
      },
      bookingId: null,
    },
    data: {
      bookingId,
    },
  });
};

const releaseRoomsByBookingId = async (bookingId: number) => {
  return await prisma.room.updateMany({
    where: {
      bookingId,
    },
    data: {
      bookingId: null,
    },
  });
};

export const roomRepository = {
  findByRoomCategoryIdAndDate,
  countByRoomCategoryIdAndDate,
  bulkCreate,
  findLatestDateByRoomCategoryId,
  findLatestDatesForAllCategories,
  findByRoomCategoryIdAndDateRange,
  updateBookingIdToRooms,
  releaseRoomsByBookingId,
};

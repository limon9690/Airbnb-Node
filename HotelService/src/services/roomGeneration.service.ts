import { serverConfig } from "../config";
import logger from "../config/logger.config";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { roomCategoryService } from "./roomCategory.service";
import { roomRepository } from "../repositories/room.repository";
import { RoomGenerationJob } from "../dto/roomGeneration.dto";

type RoomCategory = Awaited<
  ReturnType<typeof roomCategoryService.getRoomCategoryById>
>;

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const normalizeDate = (date: Date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
};

export async function generateRooms(jobData: RoomGenerationJob) {
  const roomCategory = await roomCategoryService.getRoomCategoryById(
    jobData.roomCategoryId,
  );

  if (!roomCategory) {
    throw new NotFoundError(
      `Room category with id ${jobData.roomCategoryId} not found`,
    );
  }

  const startDate = normalizeDate(new Date(jobData.startDate));
  const endDate = normalizeDate(new Date(jobData.endDate));

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new BadRequestError("Start date and end date must be valid dates");
  }

  if (startDate >= endDate) {
    throw new BadRequestError("Start date must be before end date");
  }

  const today = normalizeDate(new Date());

  if (startDate < today) {
    throw new BadRequestError("Start date must be in the future");
  }

  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / DAY_IN_MS,
  );
  logger.info(`Generating rooms for ${totalDays} days`);

  const batchSize = serverConfig.ROOM_GENERATION_BATCH_SIZE;
  const batchEndOffset = Math.max(batchSize - 1, 0);

  let totalRoomsCreated = 0;
  let totalDatesProcessed = 0;
  let currentDate = new Date(startDate);

  while (currentDate < endDate) {
    const batchEndDate = new Date(currentDate);
    batchEndDate.setDate(batchEndDate.getDate() + batchEndOffset);

    if (batchEndDate > endDate) {
      batchEndDate.setTime(endDate.getTime());
    }

    const batchResult = await processDateBatch(
      roomCategory,
      currentDate,
      batchEndDate,
      jobData.priceOverride,
    );

    totalRoomsCreated += batchResult.roomsCreated;
    totalDatesProcessed += batchResult.datesProcessed;

    currentDate = new Date(batchEndDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    totalRoomsCreated,
    totalDatesProcessed,
  };
}

export async function processDateBatch(
  roomCategory: RoomCategory,
  startDate: Date,
  endDate: Date,
  priceOverride?: number,
) {
  let roomsCreated = 0;
  let datesProcessed = 0;
  const roomsToCreate = [];

  const currentDate = normalizeDate(startDate);
  const normalizedEndDate = normalizeDate(endDate);

  while (currentDate <= normalizedEndDate) {
    const existingCount = await roomRepository.countByRoomCategoryIdAndDate(
      roomCategory.id,
      new Date(currentDate),
    );

    const roomsNeeded = roomCategory.roomCount - existingCount;

    for (let i = 0; i < roomsNeeded; i++) {
      roomsToCreate.push({
        hotelId: roomCategory.hotelId,
        roomCategoryId: roomCategory.id,
        dateOfAvailability: new Date(currentDate),
        price: priceOverride ?? roomCategory.price,
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
    datesProcessed += 1;
  }

  if (roomsToCreate.length > 0) {
    await roomRepository.bulkCreate(roomsToCreate);
    roomsCreated = roomsToCreate.length;
  }

  return {
    roomsCreated,
    datesProcessed,
  };
}

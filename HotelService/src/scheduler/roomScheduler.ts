import cron, { ScheduledTask } from "node-cron";
import { serverConfig } from "../config";
import logger from "../config/logger.config";
import { roomRepository } from "../repositories/room.repository";
import { roomCategoryService } from "../services/roomCategory.service";
import { addToRoomGenerationQueue } from "../queues/roomGeneration.queue";
import { RoomGenerationJob } from "../dto/roomGeneration.dto";

let cronJob: ScheduledTask | null = null;

const normalizeDate = (date: Date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const extendRoomAvailability = async (): Promise<void> => {
  const roomCategoriesWithLatestDates =
    await roomRepository.findLatestDatesForAllCategories();

  if (roomCategoriesWithLatestDates.length === 0) {
    logger.info("No generated room availability found to extend");
    return;
  }

  for (const categoryData of roomCategoriesWithLatestDates) {
    try {
      const roomCategory = await roomCategoryService.getRoomCategoryById(
        categoryData.roomCategoryId,
      );

      if (!roomCategory) {
        logger.warn(
          `Room category ${categoryData.roomCategoryId} not found, skipping`,
        );
        continue;
      }

      const latestDate = normalizeDate(categoryData.latestDate);
      const nextDate = addDays(latestDate, 1);
      const targetEndDate = addDays(
        latestDate,
        serverConfig.ROOM_AVAILABILITY_HORIZON_DAYS,
      );

      const existingNextDate = await roomRepository.findByRoomCategoryIdAndDate(
        categoryData.roomCategoryId,
        nextDate,
      );

      if (existingNextDate) {
        logger.debug(
          `Room category ${categoryData.roomCategoryId} already has availability on ${nextDate.toISOString()}, skipping`,
        );
        continue;
      }

      const jobData: RoomGenerationJob = {
        roomCategoryId: categoryData.roomCategoryId,
        startDate: nextDate.toISOString(),
        endDate: targetEndDate.toISOString(),
        priceOverride: roomCategory.price,
      };

      await addToRoomGenerationQueue("generate-rooms", jobData);

      logger.info(
        `Queued room generation for category ${categoryData.roomCategoryId} from ${nextDate.toISOString()} to ${targetEndDate.toISOString()}`,
      );
    } catch (error) {
      logger.error(
        `Error extending room availability for category ${categoryData.roomCategoryId}:`,
        error,
      );
    }
  }
};

export const startScheduler = (): void => {
  if (cronJob) {
    logger.warn("Room availability scheduler is already running");
    return;
  }

  cronJob = cron.schedule(
    serverConfig.ROOM_CRON,
    async () => {
      try {
        logger.info("Starting room availability extension run");
        await extendRoomAvailability();
        logger.info("Room availability extension run completed");
      } catch (error) {
        logger.error("Room availability scheduler run failed:", error);
      }
    },
    {
      timezone: "UTC",
    },
  );

  cronJob.start();
  logger.info(
    `Room availability scheduler started with cron ${serverConfig.ROOM_CRON}`,
  );
};

export const stopScheduler = (): void => {
  if (!cronJob) {
    return;
  }

  cronJob.stop();
  cronJob = null;
  logger.info("Room availability scheduler stopped");
};

export const getSchedulerStatus = (): { isRunning: boolean; cron: string } => {
  return {
    isRunning: cronJob !== null && cronJob.getStatus() === "scheduled",
    cron: serverConfig.ROOM_CRON,
  };
};

export const manualExtendAvailability = async (): Promise<void> => {
  logger.info("Manual room availability extension triggered");
  await extendRoomAvailability();
};

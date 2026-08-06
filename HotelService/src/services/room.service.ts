import { findByRoomCategoryIdAndDateRangeDTO } from "../dto/room.dto";
import { roomRepository } from "../repositories/room.repository";

const findByRoomCategoryIdAndDateRange = async (
  findByRoomCategoryIdAndDateRangeDTO: findByRoomCategoryIdAndDateRangeDTO,
) => {
  const { roomCategoryId, startDate, endDate } =
    findByRoomCategoryIdAndDateRangeDTO;

  return await roomRepository.findByRoomCategoryIdAndDateRange(
    roomCategoryId,
    new Date(startDate),
    new Date(endDate),
  );
};

export const roomService = {
  findByRoomCategoryIdAndDateRange,
};

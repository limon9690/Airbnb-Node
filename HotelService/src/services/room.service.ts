import {
  findByRoomCategoryIdAndDateRangeDTO,
  updateBookingIdToRoomsDTO,
} from "../dto/room.dto";
import { roomRepository } from "../repositories/room.repository";

const startOfDay = (date: Date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
};

const endOfDay = (date: Date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(23, 59, 59, 999);
  return normalizedDate;
};

const findByRoomCategoryIdAndDateRange = async (
  findByRoomCategoryIdAndDateRangeDTO: findByRoomCategoryIdAndDateRangeDTO,
) => {
  const { roomCategoryId, startDate, endDate } =
    findByRoomCategoryIdAndDateRangeDTO;

  return await roomRepository.findByRoomCategoryIdAndDateRange(
    roomCategoryId,
    startOfDay(new Date(startDate)),
    endOfDay(new Date(endDate)),
  );
};

const updateBookingIdToRooms = async (
  updateBookingIdToRoomsDTO: updateBookingIdToRoomsDTO,
) => {
  const { roomIds, bookingId } = updateBookingIdToRoomsDTO;

  return await roomRepository.updateBookingIdToRooms(roomIds, bookingId);
};

export const roomService = {
  findByRoomCategoryIdAndDateRange,
  updateBookingIdToRooms,
};

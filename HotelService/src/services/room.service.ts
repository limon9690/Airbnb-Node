import {
  findByRoomCategoryIdAndDateRangeDTO,
  releaseRoomsByBookingIdDTO,
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

  // endDate is the checkout date; the checkout night itself isn't consumed,
  // so the last night of the stay is the day before checkout.
  const lastNight = new Date(endDate);
  lastNight.setDate(lastNight.getDate() - 1);

  return await roomRepository.findByRoomCategoryIdAndDateRange(
    roomCategoryId,
    startOfDay(new Date(startDate)),
    endOfDay(lastNight),
  );
};

const updateBookingIdToRooms = async (
  updateBookingIdToRoomsDTO: updateBookingIdToRoomsDTO,
) => {
  const { roomIds, bookingId } = updateBookingIdToRoomsDTO;

  return await roomRepository.updateBookingIdToRooms(roomIds, bookingId);
};

const releaseRoomsByBookingId = async (
  releaseRoomsByBookingIdDTO: releaseRoomsByBookingIdDTO,
) => {
  const { bookingId } = releaseRoomsByBookingIdDTO;

  return await roomRepository.releaseRoomsByBookingId(bookingId);
};

export const roomService = {
  findByRoomCategoryIdAndDateRange,
  updateBookingIdToRooms,
  releaseRoomsByBookingId,
};

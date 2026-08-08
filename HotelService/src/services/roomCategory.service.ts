import { createRoomCategoryDTO } from "../dto/roomCategory.dto";
import { prisma } from "../utils/lib/prisma";
import { hotelService } from "./hotel.service";
import { AppRole } from "../types/auth.type";
import { ConflictError, NotFoundError } from "../utils/errors/app.error";

const createRoomCategory = async (
  roomCategoryData: createRoomCategoryDTO,
  requester: { id: number; role: AppRole },
) => {
  await hotelService.assertOwnership(roomCategoryData.hotelId, requester);

  const roomCategory = await prisma.roomCategory.create({
    data: {
      hotelId: roomCategoryData.hotelId,
      price: roomCategoryData.price,
      roomType: roomCategoryData.roomType,
      roomCount: roomCategoryData.roomCount,
    },
  });

  return roomCategory;
};

const getRoomCategoryById = async (id: number) => {
  const roomCategory = await prisma.roomCategory.findUnique({
    where: { id },
  });

  if (!roomCategory) {
    throw new Error(`Room category with ID ${id} not found`);
  }

  return roomCategory;
};

const getAllRoomCategoriesByHotelId = async (hotelId: number) => {
  const hotel = await prisma.hotel.findUnique({
    where: { id: hotelId },
  });

  if (!hotel) {
    throw new NotFoundError(`Hotel with ID ${hotelId} not found`);
  }

  const roomCategories = await prisma.roomCategory.findMany({
    where: { hotelId },
  });

  return roomCategories;
};

const deleteRoomCategory = async (
  hotelId: number,
  id: number,
  requester: { id: number; role: AppRole },
) => {
  await hotelService.assertOwnership(hotelId, requester);

  const roomCategory = await prisma.roomCategory.findUnique({
    where: { id },
  });

  if (!roomCategory || roomCategory.hotelId !== hotelId) {
    throw new NotFoundError(`Room category with ID ${id} not found`);
  }

  await prisma.$transaction(async (tx) => {
    // Only ever remove rooms that aren't tied to a booking - if any remain
    // after this, they're booked, and the whole delete gets rolled back.
    await tx.room.deleteMany({
      where: { roomCategoryId: id, bookingId: null },
    });

    const remainingRooms = await tx.room.count({
      where: { roomCategoryId: id },
    });

    if (remainingRooms > 0) {
      throw new ConflictError(
        "Cannot delete a room category with active bookings",
      );
    }

    await tx.roomCategory.delete({ where: { id } });
  });
};

export const roomCategoryService = {
  createRoomCategory,
  getRoomCategoryById,
  getAllRoomCategoriesByHotelId,
  deleteRoomCategory,
};

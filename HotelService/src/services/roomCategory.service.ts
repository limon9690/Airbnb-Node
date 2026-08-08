import { createRoomCategoryDTO } from "../dto/roomCategory.dto";
import { prisma } from "../utils/lib/prisma";
import { hotelService } from "./hotel.service";
import { AppRole } from "../types/auth.type";
import { NotFoundError } from "../utils/errors/app.error";

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

const deleteRoomCategory = async (id: number) => {
  const roomCategory = await prisma.roomCategory.findUnique({
    where: { id },
  });

  if (!roomCategory) {
    throw new Error(`Room category with ID ${id} not found`);
  }

  await prisma.roomCategory.delete({
    where: { id },
  });
};

export const roomCategoryService = {
  createRoomCategory,
  getRoomCategoryById,
  getAllRoomCategoriesByHotelId,
  deleteRoomCategory,
};

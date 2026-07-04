import { createRoomCategoryDTO } from "../dto/roomCategory.dto";
import { prisma } from "../utils/lib/prisma";

const createRoomCategory = async (roomCategoryData: createRoomCategoryDTO) => {
  const hotel = await prisma.hotel.findUnique({
    where: { id: roomCategoryData.hotelId },
  });

  if (!hotel) {
    throw new Error(`Hotel with ID ${roomCategoryData.hotelId} not found`);
  }

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
    throw new Error(`Hotel with ID ${hotelId} not found`);
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

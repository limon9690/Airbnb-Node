import { createHotelDTO } from "../dto/hotel.dto";
import {prisma} from "../utils/lib/prisma";

const createHotel = async (hotelData: createHotelDTO) => {
    return await prisma.hotel.create({ data: hotelData });
}

const getAllHotels = async () => {
    return await prisma.hotel.findMany();
}

const getHotelById = async (id: number) => {
    return await prisma.hotel.findUnique({ where: { id } });
}

const updateHotel = async (id: number, hotelData: createHotelDTO) => {
    return await prisma.hotel.update({ where: { id }, data: hotelData });
}

const deleteHotel = async (id: number) => {
    return await prisma.hotel.delete({ where: { id } });
}

export const hotelRepository = {
    createHotel,
    getAllHotels,
    getHotelById,
    updateHotel,
    deleteHotel
}
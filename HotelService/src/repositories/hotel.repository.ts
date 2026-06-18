import { createHotelDTO } from "../dto/hotel.dto";
import {prisma} from "../utils/lib/prisma";

async function createHotel(hotelData: createHotelDTO) {
    return await prisma.hotel.create({ data: hotelData });
}

const getAllHotels = async () => {
    return await prisma.hotel.findMany();
}

export const hotelRepository = {
    createHotel,
    getAllHotels
}
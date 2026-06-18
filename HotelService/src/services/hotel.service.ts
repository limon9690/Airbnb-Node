import { createHotelDTO } from "../dto/hotel.dto";
import { hotelRepository } from "../repositories/hotel.repository";

const createHotel = async (hotelData: createHotelDTO) => {
    return await hotelRepository.createHotel(hotelData);
}

const getAllHotels = async () => {
    return await hotelRepository.getAllHotels();
}

export const hotelService = {
    createHotel,
    getAllHotels
}
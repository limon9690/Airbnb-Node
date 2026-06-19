import { createHotelDTO } from "../dto/hotel.dto";
import { hotelRepository } from "../repositories/hotel.repository";

const createHotel = async (hotelData: createHotelDTO) => {
    return await hotelRepository.createHotel(hotelData);
}

const getAllHotels = async () => {
    return await hotelRepository.getAllHotels();
}

const getHotelById = async (id: number) => {
    return await hotelRepository.getHotelById(id);
}

const updateHotel = async (id: number, hotelData: createHotelDTO) => {
    return await hotelRepository.updateHotel(id, hotelData);
}

const deleteHotel = async (id: number) => {
    return await hotelRepository.deleteHotel(id);
}

export const hotelService = {
    createHotel,
    getAllHotels,
    getHotelById,
    updateHotel,
    deleteHotel
}
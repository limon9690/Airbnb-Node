import { createHotelDTO, updateHotelDTO } from "../dto/hotel.dto";
import { hotelRepository } from "../repositories/hotel.repository";
import { AppRole } from "../types/auth.type";
import { ForbiddenError, NotFoundError } from "../utils/errors/app.error";

const createHotel = async (hotelData: createHotelDTO) => {
    return await hotelRepository.createHotel(hotelData);
}

const getAllHotels = async () => {
    return await hotelRepository.getAllHotels();
}

const getHotelById = async (id: number) => {
    return await hotelRepository.getHotelById(id);
}

const assertOwnership = async (
    id: number,
    requester: { id: number; role: AppRole },
) => {
    const hotel = await hotelRepository.getHotelById(id);

    if (!hotel) {
        throw new NotFoundError("Hotel not found");
    }

    if (hotel.ownerId !== requester.id && requester.role !== AppRole.ADMIN) {
        throw new ForbiddenError("You can only manage your own hotels");
    }

    return hotel;
}

const updateHotel = async (
    id: number,
    hotelData: updateHotelDTO,
    requester: { id: number; role: AppRole },
) => {
    await assertOwnership(id, requester);
    return await hotelRepository.updateHotel(id, hotelData);
}

const deleteHotel = async (
    id: number,
    requester: { id: number; role: AppRole },
) => {
    await assertOwnership(id, requester);
    return await hotelRepository.deleteHotel(id);
}

export const hotelService = {
    createHotel,
    getAllHotels,
    getHotelById,
    updateHotel,
    deleteHotel,
    assertOwnership,
}
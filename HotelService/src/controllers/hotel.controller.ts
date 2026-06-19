import { Request, Response, NextFunction } from "express";
import { hotelService } from "../services/hotel.service";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../utils/errors/app.error";

const createHotel = async (req: Request, res : Response, next: NextFunction) => {
    try {
        const hotelData = req.body;
        const newHotel = await hotelService.createHotel(hotelData);
        
        res.status(StatusCodes.CREATED).json({
        message: "Hotel created successfully",
        data: newHotel,
        success: true,
    })
    } catch (error) {
        next(error);
    }
}

const getAllHotels = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hotels = await hotelService.getAllHotels();
        res.status(StatusCodes.OK).json({
            message: "Hotels retrieved successfully",
            data: hotels,
            success: true,
        });
    } catch (error) {
        next(error);
    }
}

const getHotelById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hotelId = parseInt(req.params.id);
        const hotel = await hotelService.getHotelById(hotelId);

        if (!hotel) {
            throw new NotFoundError("Hotel not found");
        }

        res.status(StatusCodes.OK).json({
            message: "Hotel retrieved successfully",
            data: hotel,
            success: true,
        });
    } catch (error) {
        next(error);
    }
}

const updateHotel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hotelId = parseInt(req.params.id);
        const hotelData = req.body;
        const updatedHotel = await hotelService.updateHotel(hotelId, hotelData);

        if (!updatedHotel) {
            throw new NotFoundError("Hotel not found");
        }

        res.status(StatusCodes.OK).json({
            message: "Hotel updated successfully",
            data: updatedHotel,
            success: true,
        });
    } catch (error) {
        next(error);
    }
}

const deleteHotel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hotelId = parseInt(req.params.id);
        const deletedHotel = await hotelService.deleteHotel(hotelId);

        if (!deletedHotel) {
            throw new NotFoundError("Hotel not found");
        }

        res.status(StatusCodes.OK).json({
            message: "Hotel deleted successfully",
            data: deletedHotel,
            success: true,
        });
    } catch (error) {
        next(error);
    }
}

export const hotelController = {
    createHotel,
    getAllHotels,
    getHotelById,
    updateHotel,
    deleteHotel
}
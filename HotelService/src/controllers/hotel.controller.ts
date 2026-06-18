import { Request, Response, NextFunction } from "express";
import { hotelService } from "../services/hotel.service";

const createHotel = async (req: Request, res : Response, next: NextFunction) => {
    try {
        const hotelData = req.body;
        const newHotel = await hotelService.createHotel(hotelData);
        
        res.status(201).json({
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
        res.status(200).json({
            message: "Hotels retrieved successfully",
            data: hotels,
            success: true,
        });
    } catch (error) {
        next(error);
    }
}

export const hotelController = {
    createHotel,
    getAllHotels
}
import { NextFunction, Request, Response } from "express";
import { bookingService } from "../services/booking.service";

const createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const booking = await bookingService.createBooking(req.body);    

        res.status(201).json({
        bookingId: booking.booking.id,
        idempotencyKey: booking.idempotencyKey,
    });

    } catch (error) {
        next(error);
    }
}

const confirmBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idempotencyKey } = req.params;

        const booking = await bookingService.confirmBooking(idempotencyKey);

        res.status(200).json({
        bookingId: booking.id,
        status: booking.status,
    });
    } catch (error) {
        next(error);
    }
}

export const bookingController = {
    createBooking,
    confirmBooking,
}
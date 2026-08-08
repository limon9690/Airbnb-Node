import { NextFunction, Request, Response } from "express";
import { bookingService } from "../services/booking.service";

const createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const booking = await bookingService.createBooking({
            ...req.body,
            userId: req.user!.id,
        });

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

        const booking = await bookingService.confirmBooking(
            idempotencyKey,
            { id: req.user!.id, role: req.user!.role },
            { email: req.user!.email, name: req.user!.name },
        );

        res.status(200).json({
        bookingId: booking.id,
        status: booking.status,
    });
    } catch (error) {
        next(error);
    }
}

const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookingId = Number(req.params.bookingId);

        const booking = await bookingService.cancelBooking(bookingId, {
            id: req.user!.id,
            role: req.user!.role,
        });

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
    cancelBooking,
}
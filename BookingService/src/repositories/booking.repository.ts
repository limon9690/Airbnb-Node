import { CreateBookingDto } from "../dto/booking.dto";
import { prisma } from "../utils/lib/prisma";

const createBooking = async (bookingData: CreateBookingDto) => {
    return await prisma.booking.create({
        data: bookingData,
    });
}

const createIdempotencyKey = async (key: string, bookingId: number) => {
    return await prisma.idempotencyKey.create({
        data: {
            key,
            booking: {
                connect: { id: bookingId }
            }
        },
    });
}

const getIdempotencyKey = async (key: string) => {
    return await prisma.idempotencyKey.findUnique({
        where: { key },
    });
}

const getBookingById = async (id: number) => {
    return await prisma.booking.findUnique({
        where: { id },
    });
}

const confirmBooking = async (id: number) => {
    return await prisma.booking.update({
        where: { id },
        data: { status: 'CONFIRMED' },
    });
}

const cancelBooking = async (id: number) => {
    return await prisma.booking.update({
        where: { id },
        data: { status: 'CANCELLED' },
    });
}

const finalizeIdempotencyKey = async (key: string) => {
    return await prisma.idempotencyKey.update({
        where: { key },
        data: { finalized: true },
    });
}

export const bookingRepository = {
    createBooking,
    createIdempotencyKey,
    getIdempotencyKey,
    getBookingById,
    confirmBooking,
    cancelBooking,
    finalizeIdempotencyKey,
};
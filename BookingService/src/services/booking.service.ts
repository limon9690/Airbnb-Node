import { getAvailableRooms, updateBookingIdToRooms } from "../api/rooms.api";
import { serverConfig } from "../config";
import { redlock } from "../config/redis.config";
import { CreateBookingDto } from "../dto/booking.dto";
import { addToEmailQueue } from "../producers/email.producer";
import { bookingRepository } from "../repositories/booking.repository";
import { InternalServerError, NotFoundError } from "../utils/errors/app.error";
import { generateIdempotencyKey } from "../utils/helpers/generateIdempotencyKey";
import { prisma } from "../utils/lib/prisma";

type AvailableRoom = {
  id: number;
  roomNumber: string;
  roomCategoryId: number;
  hotelId: number;
};

const createBooking = async (bookingData: CreateBookingDto) => {
  const bookingResource = `booking:${bookingData.hotelId}`;

  try {
    await redlock.acquire([bookingResource], serverConfig.BOOKING_LOCK_TTL);

    const availableRooms = await getAvailableRooms(
      bookingData.roomCategoryId,
      bookingData.checkInDate,
      bookingData.checkOutDate,
    );

    const totalNights = Math.ceil(
      (new Date(bookingData.checkOutDate).getTime() -
        new Date(bookingData.checkInDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (availableRooms.length === 0 || totalNights > availableRooms.length) {
      throw new NotFoundError(
        "No available rooms for the given dates and room category",
      );
    }

    const booking = await bookingRepository.createBooking(bookingData);
    const idempotencyKey = generateIdempotencyKey();

    const idempotencyRecord = await bookingRepository.createIdempotencyKey(
      idempotencyKey,
      booking.id,
    );

    console.log(availableRooms);

    await updateBookingIdToRooms(
      booking.id,
      availableRooms.data?.map((room: AvailableRoom) => room.id),
    );

    return { booking: booking, idempotencyKey: idempotencyRecord.idemKey };
  } catch (error: any) {
    throw new InternalServerError(error.message);
  }
};

const confirmBooking = async (idempotencyKey: string) => {
  return await prisma.$transaction(async (tx) => {
    const idempotencyRecord = await bookingRepository.getIdempotencyKey(
      tx,
      idempotencyKey,
    );

    if (!idempotencyRecord) {
      throw new NotFoundError("Invalid idempotency key");
    }

    if (idempotencyRecord.finalized) {
      throw new NotFoundError("Idempotency key has already been finalized");
    }

    const booking = await bookingRepository.confirmBooking(
      tx,
      idempotencyRecord.bookingId,
    );

    await bookingRepository.finalizeIdempotencyKey(tx, idempotencyKey);

    addToEmailQueue("sendWelcomeEmail", {
      from: "support@ihlimon.tech",
      to: "limon.hossain26@yahoo.com",
      subject: "Welcome to Airbnb!",
      templateID: "welcome-email",
      params: {
        name: "John Doe",
      },
    });

    return booking;
  });
};

export const bookingService = {
  createBooking,
  confirmBooking,
};

import {
  getAvailableRooms,
  releaseRoomsByBookingId,
  updateBookingIdToRooms,
} from "../api/rooms.api";
import { serverConfig } from "../config";
import { redlock } from "../config/redis.config";
import { CreateBookingDto } from "../dto/booking.dto";
import { addToEmailQueue } from "../producers/email.producer";
import { bookingRepository } from "../repositories/booking.repository";
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
} from "../utils/errors/app.error";
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

    const availableRoomsResponse = await getAvailableRooms(
      bookingData.roomCategoryId,
      bookingData.checkInDate,
      bookingData.checkOutDate,
    );
    const availableRooms: AvailableRoom[] = availableRoomsResponse.data ?? [];

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

    // Only claim exactly as many room-nights as the stay needs.
    const roomIdsToClaim = availableRooms
      .slice(0, totalNights)
      .map((room) => room.id);

    const booking = await bookingRepository.createBooking(bookingData);

    // Claim is conditional (bookingId must still be null) so a concurrent
    // booking racing for the same rooms can't silently get overwritten.
    const claimResult = await updateBookingIdToRooms(
      booking.id,
      roomIdsToClaim,
    );
    const claimedCount = claimResult.data?.count ?? 0;

    if (claimedCount !== roomIdsToClaim.length) {
      await releaseRoomsByBookingId(booking.id);
      await bookingRepository.cancelBooking(booking.id);
      throw new ConflictError(
        "Some rooms were booked by someone else, please try again",
      );
    }

    const idempotencyKey = generateIdempotencyKey();
    const idempotencyRecord = await bookingRepository.createIdempotencyKey(
      idempotencyKey,
      booking.id,
    );

    return { booking: booking, idempotencyKey: idempotencyRecord.idemKey };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ConflictError) {
      throw error;
    }
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

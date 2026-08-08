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
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from "../utils/errors/app.error";
import { generateIdempotencyKey } from "../utils/helpers/generateIdempotencyKey";
import { prisma } from "../utils/lib/prisma";
import { AppRole } from "../types/auth.type";

type AvailableRoom = {
  id: number;
  price: number;
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
    const roomsToClaim = availableRooms.slice(0, totalNights);
    const roomIdsToClaim = roomsToClaim.map((room) => room.id);

    const bookingAmount = roomsToClaim.reduce(
      (sum, room) => sum + room.price,
      0,
    );

    const booking = await bookingRepository.createBooking({
      ...bookingData,
      bookingAmount,
    });

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

const confirmBooking = async (
  idempotencyKey: string,
  requester: { id: number; role: AppRole },
  recipient: { email: string; name: string },
) => {
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

    const existingBooking = await tx.booking.findUnique({
      where: { id: idempotencyRecord.bookingId },
    });

    if (!existingBooking) {
      throw new NotFoundError("Booking not found");
    }

    if (
      existingBooking.userId !== requester.id &&
      requester.role !== AppRole.ADMIN
    ) {
      throw new ForbiddenError("You can only confirm your own bookings");
    }

    const booking = await bookingRepository.confirmBooking(
      tx,
      idempotencyRecord.bookingId,
    );

    await bookingRepository.finalizeIdempotencyKey(tx, idempotencyKey);

    addToEmailQueue("sendBookingConfirmationEmail", {
      from: "support@ihlimon.tech",
      to: recipient.email,
      subject: "Your booking is confirmed!",
      templateID: "booking-confirmation-airbnb",
      params: {
        name: recipient.name,
        checkInDate: booking.checkInDate.toISOString().split("T")[0],
        checkOutDate: booking.checkOutDate.toISOString().split("T")[0],
        totalGuests: String(booking.totalGuests),
        bookingAmount: String(booking.bookingAmount),
      },
    });

    return booking;
  });
};

const cancelBooking = async (
  bookingId: number,
  requester: { id: number; role: AppRole },
) => {
  const booking = await bookingRepository.getBookingById(bookingId);

  if (!booking) {
    throw new NotFoundError("Booking not found");
  }

  if (booking.userId !== requester.id && requester.role !== AppRole.ADMIN) {
    throw new ForbiddenError("You can only cancel your own bookings");
  }

  if (booking.status === "CANCELLED") {
    throw new ConflictError("Booking is already cancelled");
  }

  // Release rooms before flipping the status, so a failure here never
  // leaves rooms stuck claimed against a booking that already looks cancelled.
  await releaseRoomsByBookingId(booking.id);

  return await bookingRepository.cancelBooking(booking.id);
};

export const bookingService = {
  createBooking,
  confirmBooking,
  cancelBooking,
};

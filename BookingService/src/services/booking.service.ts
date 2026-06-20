import { CreateBookingDto } from "../dto/booking.dto";
import { bookingRepository } from "../repositories/booking.repository";
import { NotFoundError } from "../utils/errors/app.error";
import { generateIdempotencyKey } from "../utils/helpers/generateIdempotencyKey";
import { prisma } from "../utils/lib/prisma";

const createBooking = async (bookingData: CreateBookingDto) => {
  const booking = await bookingRepository.createBooking(bookingData);

  const idempotencyKey = generateIdempotencyKey();

  const idempotencyRecord = await bookingRepository.createIdempotencyKey(
    idempotencyKey,
    booking.id,
  );

  return { booking: booking, idempotencyKey: idempotencyRecord.idemKey };
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

    return booking;
  });
};

export const bookingService = {
  createBooking,
  confirmBooking,
};

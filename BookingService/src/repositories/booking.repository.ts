import { IdempotencyKey, Prisma } from "../../generated/prisma/client";
import { CreateBookingDto } from "../dto/booking.dto";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { prisma } from "../utils/lib/prisma";
import { validate as isValidUUID } from "uuid";

const createBooking = async (bookingData: CreateBookingDto) => {
  return await prisma.booking.create({
    data: bookingData,
  });
};

const createIdempotencyKey = async (key: string, bookingId: number) => {
  return await prisma.idempotencyKey.create({
    data: {
      idemKey: key,
      booking: {
        connect: { id: bookingId },
      },
    },
  });
};

const getIdempotencyKey = async (tx: Prisma.TransactionClient, key: string) => {
  if (!isValidUUID(key)) {
    throw new BadRequestError("Invalid idempotency key");
  }

  const result: Array<IdempotencyKey> =
    await tx.$queryRaw`SELECT * FROM \`IdempotencyKey\` WHERE \`idemKey\` = ${key} FOR UPDATE;`;

  if (!result || result.length === 0) {
    throw new NotFoundError("Idempotency key not found");
  }

  return result[0];
};

const getBookingById = async (id: number) => {
  return await prisma.booking.findUnique({
    where: { id },
  });
};

const confirmBooking = async (tx: Prisma.TransactionClient, id: number) => {
  return await tx.booking.update({
    where: { id },
    data: { status: "CONFIRMED" },
  });
};

const cancelBooking = async (id: number) => {
  return await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
};

const finalizeIdempotencyKey = async (
  tx: Prisma.TransactionClient,
  key: string,
) => {
  return await tx.idempotencyKey.update({
    where: { idemKey: key },
    data: { finalized: true },
  });
};

export const bookingRepository = {
  createBooking,
  createIdempotencyKey,
  getIdempotencyKey,
  getBookingById,
  confirmBooking,
  cancelBooking,
  finalizeIdempotencyKey,
};

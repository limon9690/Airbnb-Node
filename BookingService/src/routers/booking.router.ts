import express from "express";
import { bookingController } from "../controllers/booking.controller";
import { createBookingSchema } from "../validators/hotel.validator";
import { validateRequestBody } from "../validators";
import { auth } from "../middlewares/auth.middleware";
import { AppRole } from "../types/auth.type";

const router = express.Router();

router.post(
  "",
  auth([AppRole.USER, AppRole.OWNER, AppRole.ADMIN]),
  validateRequestBody(createBookingSchema),
  bookingController.createBooking,
);
router.post(
  "/:idempotencyKey",
  auth([AppRole.USER, AppRole.OWNER, AppRole.ADMIN]),
  bookingController.confirmBooking,
);
router.post(
  "/:bookingId/cancel",
  auth([AppRole.USER, AppRole.OWNER, AppRole.ADMIN]),
  bookingController.cancelBooking,
);

export const bookingRouter = router;

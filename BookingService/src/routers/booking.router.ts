import express from 'express';
import { bookingController } from '../controllers/booking.controller';
import { createBookingSchema } from '../validators/hotel.validator';
import { validateRequestBody } from '../validators';


const router = express.Router();

router.post('/', validateRequestBody(createBookingSchema), bookingController.createBooking);
router.post('/:idempotencyKey', bookingController.confirmBooking);

export const bookingRouter = router;
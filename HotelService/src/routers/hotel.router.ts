import express from 'express';
import { hotelController } from '../controllers/hotel.controller';
import { validateRequestBody } from '../validators';
import { createHotelSchema } from '../validators/hotel.validator';

const router = express.Router();

router.post('/', validateRequestBody(createHotelSchema), hotelController.createHotel);
router.get('/', hotelController.getAllHotels);

export const HotelRouter = router;
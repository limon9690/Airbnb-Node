import express from 'express';
import { hotelController } from '../controllers/hotel.controller';
import { validateRequestBody } from '../validators';
import { createHotelSchema, updateHotelSchema } from '../validators/hotel.validator';

const router = express.Router();

router.post('/', validateRequestBody(createHotelSchema), hotelController.createHotel);
router.get('/', hotelController.getAllHotels);
router.get('/:id', hotelController.getHotelById);
router.put('/:id', validateRequestBody(updateHotelSchema), hotelController.updateHotel);
router.delete('/:id', hotelController.deleteHotel);

export const HotelRouter = router;
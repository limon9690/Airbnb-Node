import express from "express";
import { hotelController } from "../controllers/room.controller";
import {
  findByRoomCategoryIdAndDateRangeSchema,
  updateBookingIdToRoomsSchema,
} from "../validators/room.validator";
import { validateQueryParams, validateRequestBody } from "../validators";

const router = express.Router();

router.get(
  "/available-rooms",
  validateQueryParams(findByRoomCategoryIdAndDateRangeSchema),
  hotelController.findByRoomCategoryIdAndDateRange,
);

router.put(
  "/update-booking-id",
  validateRequestBody(updateBookingIdToRoomsSchema),
  hotelController.updateBookingIdToRooms,
);

export const roomRouter = router;

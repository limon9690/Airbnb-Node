import express from "express";
import { hotelController } from "../controllers/room.controller";
import {
  findByRoomCategoryIdAndDateRangeSchema,
  releaseRoomsByBookingIdSchema,
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

router.put(
  "/release-booking-rooms",
  validateRequestBody(releaseRoomsByBookingIdSchema),
  hotelController.releaseRoomsByBookingId,
);

export const roomRouter = router;

import express from "express";
import { hotelController } from "../controllers/room.controller";
import { findByRoomCategoryIdAndDateRangeSchema } from "../validators/room.validator";
import { validateRequestBody } from "../validators";

const router = express.Router();

router.get(
  "/available-rooms",
  validateRequestBody(findByRoomCategoryIdAndDateRangeSchema),
  hotelController.findByRoomCategoryIdAndDateRange,
);

export const roomRouter = router;

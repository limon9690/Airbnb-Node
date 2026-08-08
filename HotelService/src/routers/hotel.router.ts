import express from "express";
import { hotelController } from "../controllers/hotel.controller";
import { validateRequestBody } from "../validators";
import {
  createHotelSchema,
  updateHotelSchema,
} from "../validators/hotel.validator";
import { roomGenerationController } from "../controllers/roomGeneration.controller";
import { RoomGenerationRequestSchema } from "../dto/roomGeneration.dto";
import { auth } from "../middlewares/auth.middleware";
import { AppRole } from "../types/auth.type";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Hotel Service API",
    success: true,
  });
});

router.post(
  "/",
  auth([AppRole.OWNER]),
  validateRequestBody(createHotelSchema),
  hotelController.createHotel,
);
router.get("/", hotelController.getAllHotels);
router.get("/:id", hotelController.getHotelById);
router.put(
  "/:id",
  auth([AppRole.OWNER, AppRole.ADMIN]),
  validateRequestBody(updateHotelSchema),
  hotelController.updateHotel,
);

router.delete(
  "/:id",
  auth([AppRole.OWNER, AppRole.ADMIN]),
  hotelController.deleteHotel,
);

router.post(
  "/generate-rooms",
  auth([AppRole.OWNER, AppRole.ADMIN]),
  validateRequestBody(RoomGenerationRequestSchema),
  roomGenerationController.generateRoomAvailability,
);

export const HotelRouter = router;

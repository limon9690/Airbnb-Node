import express from "express";
import { hotelController } from "../controllers/hotel.controller";
import { validateRequestBody } from "../validators";
import {
  createHotelSchema,
  updateHotelSchema,
} from "../validators/hotel.validator";
import { roomGenerationController } from "../controllers/roomGeneration.controller";
import { RoomGenerationRequestSchema } from "../dto/roomGeneration.dto";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Hotel Service API",
    success: true,
  });
});

router.post(
  "/",
  validateRequestBody(createHotelSchema),
  hotelController.createHotel,
);
router.get("/", hotelController.getAllHotels);
router.get("/:id", hotelController.getHotelById);
router.put(
  "/:id",
  validateRequestBody(updateHotelSchema),
  hotelController.updateHotel,
);

router.delete("/:id", hotelController.deleteHotel);

router.post(
  "/generate-rooms",
  validateRequestBody(RoomGenerationRequestSchema),
  roomGenerationController.generateRoomAvailability,
);

export const HotelRouter = router;

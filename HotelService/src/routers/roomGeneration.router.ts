import express from "express";
import { roomGenerationController } from "../controllers/roomGeneration.controller";
import { validateRequestBody } from "../validators";
import { RoomGenerationRequestSchema } from "../dto/roomGeneration.dto";

const router = express.Router();

router.post(
  "/generate-rooms",
  validateRequestBody(RoomGenerationRequestSchema),
  roomGenerationController.generateRoomAvailability,
);

export const RoomGenerationRouter = router;

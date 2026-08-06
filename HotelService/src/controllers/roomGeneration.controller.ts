import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { RoomGenerationRequest } from "../dto/roomGeneration.dto";
import { addToRoomGenerationQueue } from "../queues/roomGeneration.queue";

const generateRoomAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const roomGenerationRequest = req.body as RoomGenerationRequest;

    await addToRoomGenerationQueue("generate-rooms", {
      roomCategoryId: roomGenerationRequest.roomCategoryId,
      startDate: roomGenerationRequest.startDate,
      endDate: roomGenerationRequest.endDate,
      priceOverride: roomGenerationRequest.priceOverride,
    });

    res.status(StatusCodes.ACCEPTED).json({
      message: "Room generation job has been queued successfully",
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const roomGenerationController = {
  generateRoomAvailability,
};

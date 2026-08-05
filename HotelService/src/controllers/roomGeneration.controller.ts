import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { generateRooms } from "../services/roomGeneration.service";
import { RoomGenerationRequest } from "../dto/roomGeneration.dto";

const generateRoomAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const roomGenerationRequest = req.body as RoomGenerationRequest;

    const result = await generateRooms({
      roomCategoryId: roomGenerationRequest.roomCategoryId,
      startDate: roomGenerationRequest.startDate,
      endDate: roomGenerationRequest.endDate,
      priceOverride: roomGenerationRequest.priceOverride,
    });

    res.status(StatusCodes.CREATED).json({
      message: "Room availability generated successfully",
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const roomGenerationController = {
  generateRoomAvailability,
};

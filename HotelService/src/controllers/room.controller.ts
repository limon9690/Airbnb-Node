import { NextFunction, Request, Response } from "express";
import { roomService } from "../services/room.service";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";

const findByRoomCategoryIdAndDateRange = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = roomService.findByRoomCategoryIdAndDateRange(req.body);

    res.status(StatusCodes.OK).json({
      message: "Rooms retrieved successfully",
      data: result,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const hotelController = {
  findByRoomCategoryIdAndDateRange,
};

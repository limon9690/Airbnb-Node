import { NextFunction, Request, Response } from "express";
import { roomService } from "../services/room.service";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";

const findByRoomCategoryIdAndDateRange = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { roomCategoryId, startDate, endDate } = req.query;

    const result = await roomService.findByRoomCategoryIdAndDateRange({
      roomCategoryId: Number(roomCategoryId),
      startDate: String(startDate),
      endDate: String(endDate),
    });

    res.status(StatusCodes.OK).json({
      message: "Rooms retrieved successfully",
      data: result,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const updateBookingIdToRooms = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await roomService.updateBookingIdToRooms(req.body);

    res.status(StatusCodes.OK).json({
      message: "Booking ID updated successfully for rooms",
      data: result,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const hotelController = {
  findByRoomCategoryIdAndDateRange,
  updateBookingIdToRooms,
};

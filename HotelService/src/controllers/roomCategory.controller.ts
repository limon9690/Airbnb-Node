import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { roomCategoryService } from "../services/roomCategory.service";

const createRoomCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const hotelId = Number(req.params.hotelId);

    const roomCategory = await roomCategoryService.createRoomCategory(
      { ...req.body, hotelId },
      { id: req.user!.id, role: req.user!.role },
    );

    res.status(StatusCodes.CREATED).json({
      message: "Room category created successfully",
      data: roomCategory,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getAllRoomCategoriesByHotelId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const hotelId = Number(req.params.hotelId);

    const roomCategories =
      await roomCategoryService.getAllRoomCategoriesByHotelId(hotelId);

    res.status(StatusCodes.OK).json({
      message: "Room categories retrieved successfully",
      data: roomCategories,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRoomCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const hotelId = Number(req.params.hotelId);
    const id = Number(req.params.id);

    await roomCategoryService.deleteRoomCategory(hotelId, id, {
      id: req.user!.id,
      role: req.user!.role,
    });

    res.status(StatusCodes.OK).json({
      message: "Room category deleted successfully",
      data: null,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const roomCategoryController = {
  createRoomCategory,
  getAllRoomCategoriesByHotelId,
  deleteRoomCategory,
};

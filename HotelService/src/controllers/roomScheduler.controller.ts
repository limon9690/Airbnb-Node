import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  getSchedulerStatus,
  manualExtendAvailability,
  startScheduler,
  stopScheduler,
} from "../scheduler/roomScheduler";

export async function startSchedulerHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    startScheduler();

    res.status(StatusCodes.OK).json({
      message: "Room availability scheduler started successfully",
      success: true,
      data: { status: "started" },
    });
  } catch (error) {
    next(error);
  }
}

export async function stopSchedulerHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    stopScheduler();

    res.status(StatusCodes.OK).json({
      message: "Room availability scheduler stopped successfully",
      success: true,
      data: { status: "stopped" },
    });
  } catch (error) {
    next(error);
  }
}

export async function getSchedulerStatusHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const status = getSchedulerStatus();

    res.status(StatusCodes.OK).json({
      message: "Scheduler status retrieved successfully",
      success: true,
      data: status,
    });
  } catch (error) {
    next(error);
  }
}

export async function manualExtendAvailabilityHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await manualExtendAvailability();

    res.status(StatusCodes.OK).json({
      message: "Manual room availability extension completed successfully",
      success: true,
      data: { action: "manual_extension_completed" },
    });
  } catch (error) {
    next(error);
  }
}

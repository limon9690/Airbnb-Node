import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const user = await UserService.signUp(payload);

    res.status(StatusCodes.CREATED).json({
      message: "User created successfully",
      data: user,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const data = await UserService.signIn(payload);

    res.status(StatusCodes.OK).json({
      message: "User signed in successfully",
      data,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await UserService.getUserById(Number(id));

    res.status(StatusCodes.OK).json({
      message: "User retrieved successfully",
      data: user,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(StatusCodes.OK).json({
      message: "Users retrieved successfully",
      data: users,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await UserService.deleteUserById(Number(id));
    res.status(StatusCodes.OK).json({
      message: "User deleted successfully",
      data: null,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  signUp,
  getUserById,
  getAllUsers,
  deleteUserById,
  signIn,
};

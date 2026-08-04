import { serverConfig } from "../config";
import { signInDTO, signUpDTO } from "../dto/user.dto";
import { UserRepository } from "../repositories/user.repository";
import bcrypt from "bcrypt";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/helpers/jwt.helper";
import { UserProfile } from "../types/user.type";
import { User } from "../../generated/prisma/client";
import { setRefreshTokenInCookie } from "../utils/helpers/cookie.helper";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const signUp = async (payload: signUpDTO) => {
  const existingUser = await UserRepository.getUserByEmail(payload.email);

  if (existingUser) {
    throw new BadRequestError("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    serverConfig.SALT_ROUNDS,
  );

  payload.password = hashedPassword;

  const user = await UserRepository.createUser(payload);

  const data: UserProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return data;
};

const signIn = async (payload: signInDTO, res: Response) => {
  const user = await UserRepository.getUserByEmail(payload.email);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isMatch = await bcrypt.compare(payload.password, user.password);

  if (!isMatch) {
    throw new NotFoundError("Invalid credentials");
  }

  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  await UserRepository.updateRefreshToken(user.id, refreshToken);

  res.clearCookie("refreshToken");
  setRefreshTokenInCookie(res, refreshToken);

  const userData: UserProfile = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return { data: userData, accessToken };
};

const logout = async (id: number, res: Response) => {
  await UserRepository.deleteRefreshToken(id);
  res.clearCookie("refreshToken");
};

const refreshToken = async (id: number, req: Request) => {
  const user = await UserRepository.getUserById(id);
  const refreshToken = req.cookies.refreshToken;

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (!refreshToken) {
    throw new BadRequestError("Refresh token is missing");
  }

  if (!user.refreshToken) {
    throw new BadRequestError("No refresh token found for this user");
  }

  if (user.refreshToken !== refreshToken) {
    throw new BadRequestError("Invalid refresh token");
  }

  if (
    jwt.verify(refreshToken, serverConfig.REFRESH_TOKEN_SECRET as string) ===
    null
  ) {
    throw new BadRequestError("Refresh token has expired");
  }

  const newAccessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return newAccessToken;
};

const getUserProfile = async (id: number) => {
  const user = await UserRepository.getUserById(id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const data: UserProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return data;
};

const getAllUsers = async () => {
  const users = await UserRepository.getAllUsers();

  const userProfiles: UserProfile[] = users.map((user: User) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));

  return userProfiles;
};

const deleteUser = async (id: number) => {
  const user = await UserRepository.getUserById(id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return await UserRepository.deleteUserById(id);
};

export const UserService = {
  signUp,
  getUserProfile,
  getAllUsers,
  deleteUser,
  signIn,
  logout,
  refreshToken,
};

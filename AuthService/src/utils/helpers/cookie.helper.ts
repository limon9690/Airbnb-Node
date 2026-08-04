import { Response } from "express";

export const setRefreshTokenInCookie = (res: Response, token: string) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true in production
    sameSite: "strict", // Adjust based on your requirements
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days (in milliseconds)
  });
};

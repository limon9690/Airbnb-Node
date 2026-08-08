import { NextFunction, Request, Response } from "express";
import { serverConfig } from "../config";
import { ForbiddenError } from "../utils/errors/app.error";

export const internalAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.headers["x-internal-api-key"];

  if (!apiKey || apiKey !== serverConfig.INTERNAL_API_KEY) {
    throw new ForbiddenError("This endpoint is for internal service use only.");
  }

  next();
};

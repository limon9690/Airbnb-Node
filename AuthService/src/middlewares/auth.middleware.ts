import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../utils/errors/app.error";
import jwt from "jsonwebtoken";
import { serverConfig } from "../config";

export interface DecodedToken {
  id: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  // 1. Extract the access token from the HttpOnly cookie
  const token = req.headers["authorization"]?.split(" ")[1]; // Assuming the token is sent in the Authorization header as "Bearer <token>"

  // If there's no access token, return an error
  if (!token) {
    throw new UnauthorizedError("Access token is missing. Please log in.");
  }

  try {
    // 2. Verify the token using the secret from the auth config
    const decodedToken = jwt.verify(
      token,
      serverConfig.JWT_SECRET as string,
    ) as DecodedToken; // Type assertion for better type safety

    // If the token is valid, attach user information to the request object
    req.user = decodedToken;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    throw new UnauthorizedError(
      "Invalid or expired token. Please log in again.",
    );
  }
};

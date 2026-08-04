import { serverConfig } from "../../config";
import jwt from "jsonwebtoken";

export const generateAccessToken = (payload: object): string => {
  const token = jwt.sign(
    payload,
    serverConfig.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: serverConfig.ACCESS_TOKEN_EXPIRES_IN,
    } as jwt.SignOptions,
  );

  return token;
};

export const generateRefreshToken = (payload: object): string => {
  const token = jwt.sign(
    payload,
    serverConfig.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: serverConfig.REFRESH_TOKEN_EXPIRES_IN,
    } as jwt.SignOptions,
  );

  return token;
};

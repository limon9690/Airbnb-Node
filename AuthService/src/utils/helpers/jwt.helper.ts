import { serverConfig } from "../../config";
import jwt from "jsonwebtoken";

export const generateJWTToken = (payload: object): string => {
  const token = jwt.sign(
    payload,
    serverConfig.JWT_SECRET as string,
    {
      expiresIn: serverConfig.JWT_EXPIRES_IN,
    } as jwt.SignOptions,
  );

  return token;
};

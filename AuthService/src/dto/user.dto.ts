import { AppRole } from "../../generated/prisma/client";

export type signUpDTO = {
  name: string;
  email: string;
  password: string;
  role: AppRole;
};

export type signInDTO = {
  email: string;
  password: string;
};

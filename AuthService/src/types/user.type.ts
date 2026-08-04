import { AppRole } from "../../generated/prisma/client";

export type UserProfile = {
  id: number;
  name: string;
  email: string;
  role: AppRole;
  createdAt: Date;
  updatedAt: Date;
};

import { signUpDTO } from "../dto/user.dto";
import { prisma } from "../utils/lib/prisma";

const createUser = async (payload: signUpDTO) => {
  return await prisma.user.create({
    data: payload,
  });
};

const getUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

const updateRefreshToken = async (id: number, refreshToken: string) => {
  return await prisma.user.update({
    where: { id },
    data: { refreshToken },
  });
};

const deleteRefreshToken = async (id: number) => {
  return await prisma.user.update({
    where: { id },
    data: { refreshToken: null },
  });
};

const getAllUsers = async () => {
  return await prisma.user.findMany();
};

const deleteUserById = async (id: number) => {
  return await prisma.user.delete({
    where: { id },
  });
};

const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const UserRepository = {
  createUser,
  getUserById,
  getAllUsers,
  deleteUserById,
  getUserByEmail,
  updateRefreshToken,
  deleteRefreshToken,
};

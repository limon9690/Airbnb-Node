import { CreateUserDTO } from "../dto/user.dto";
import { prisma } from "../utils/lib/prisma";

const createUser = async (payload: CreateUserDTO) => {
  return await prisma.user.create({
    data: payload,
  });
};

const getUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
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

export const UserRepository = {
  createUser,
  getUserById,
  getAllUsers,
  deleteUserById,
};

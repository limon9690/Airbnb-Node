import { serverConfig } from "../config";
import { CreateUserDTO } from "../dto/user.dto";
import { UserRepository } from "../repositories/user.repository";
import bcrypt from "bcrypt";
import { NotFoundError } from "../utils/errors/app.error";

const createUser = async (payload: CreateUserDTO) => {
  const hashedPassword = await bcrypt.hash(
    payload.password,
    serverConfig.SALT_ROUNDS,
  );
  payload.password = hashedPassword;
  return await UserRepository.createUser(payload);
};

const getUserById = async (id: number) => {
  const user = await UserRepository.getUserById(id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};

const getAllUsers = async () => {
  return await UserRepository.getAllUsers();
};

const deleteUserById = async (id: number) => {
  const user = await UserRepository.getUserById(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return await UserRepository.deleteUserById(id);
};

export const UserService = {
  createUser,
  getUserById,
  getAllUsers,
  deleteUserById,
};

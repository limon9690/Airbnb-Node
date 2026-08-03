import { serverConfig } from "../config";
import { signInDTO, signUpDTO } from "../dto/user.dto";
import { UserRepository } from "../repositories/user.repository";
import bcrypt from "bcrypt";
import { NotFoundError } from "../utils/errors/app.error";
import { generateJWTToken } from "../utils/helpers/jwt.helper";

const signUp = async (payload: signUpDTO) => {
  const hashedPassword = await bcrypt.hash(
    payload.password,
    serverConfig.SALT_ROUNDS,
  );

  payload.password = hashedPassword;

  return await UserRepository.createUser(payload);
};

const signIn = async (payload: signInDTO) => {
  const user = await UserRepository.getUserByEmail(payload.email);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isMatch = await bcrypt.compare(payload.password, user.password);

  if (!isMatch) {
    throw new NotFoundError("Invalid credentials");
  }

  const token = generateJWTToken({ id: user.id, email: user.email });
  const data = {
    id: user.id,
    email: user.email,
    token,
  };

  return data;
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
  signUp,
  getUserById,
  getAllUsers,
  deleteUserById,
  signIn,
};

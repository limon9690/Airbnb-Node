// This file contains all the basic configuration logic for the app server to work
import dotenv from "dotenv";

type ServerConfig = {
  PORT: number;
  DATABASE_URL: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  connectionLimit: number;
  REDIS_URL: string;
  BOOKING_LOCK_TTL: number;
  REDIS_HOST: string;
  REDIS_PORT: number;
};

function loadEnv() {
  dotenv.config();
  console.log(`Environment variables loaded`);
}

loadEnv();

export const serverConfig: ServerConfig = {
  PORT: Number(process.env.PORT) || 3001,
  DATABASE_URL: process.env.DATABASE_URL as string,
  DATABASE_HOST: process.env.DATABASE_HOST as string,
  DATABASE_PORT: Number(process.env.DATABASE_PORT) || 3306,
  DATABASE_USER: process.env.DATABASE_USER as string,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD as string,
  DATABASE_NAME: process.env.DATABASE_NAME as string,
  REDIS_URL: process.env.REDIS_URL as string,
  BOOKING_LOCK_TTL: Number(process.env.BOOKING_LOCK_TTL) || 60000,
  connectionLimit: Number(process.env.connectionLimit) || 5,
  REDIS_HOST: process.env.REDIS_HOST as string,
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
};

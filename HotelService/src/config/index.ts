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
  ROOM_GENERATION_BATCH_SIZE: number;
  REDIS_HOST: string;
  REDIS_PORT: number;
  ROOM_CRON: string;
  ROOM_AVAILABILITY_HORIZON_DAYS: number;
  ACCESS_TOKEN_SECRET: string;
  INTERNAL_API_KEY: string;
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
  connectionLimit: Number(process.env.connectionLimit) || 5,
  ROOM_GENERATION_BATCH_SIZE:
    Number(process.env.ROOM_GENERATION_BATCH_SIZE) || 100,
  REDIS_HOST: process.env.REDIS_HOST as string,
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
  ROOM_CRON: process.env.ROOM_CRON || "*/5 * * * *",
  ROOM_AVAILABILITY_HORIZON_DAYS:
    Number(process.env.ROOM_AVAILABILITY_HORIZON_DAYS) || 2,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY as string,
};

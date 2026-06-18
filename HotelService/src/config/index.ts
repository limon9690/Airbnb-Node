// This file contains all the basic configuration logic for the app server to work
import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number,
    DATABASE_URL: string,
    DATABASE_HOST: string,
    DATABASE_PORT: number,
    DATABASE_USER: string,
    DATABASE_PASSWORD: string,
    DATABASE_NAME: string,
    connectionLimit: number
}

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
    connectionLimit: Number(process.env.connectionLimit) || 5
};
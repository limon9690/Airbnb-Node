import { Redis } from "ioredis";
import { serverConfig } from ".";
import { InternalServerError } from "../utils/errors/app.error";

let connection: Redis;

const connectToRedis = () => {
  try {
    if (!connection) {
      connection = new Redis({
        host: serverConfig.REDIS_HOST,
        port: serverConfig.REDIS_PORT,
        maxRetriesPerRequest: null,
      });
    }

    return connection;
  } catch (error) {
    console.error("Error connecting to Redis:", error);
    throw new InternalServerError("Failed to connect to Redis");
  }
};

export default connectToRedis;

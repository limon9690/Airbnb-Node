import Redis from "ioredis";
import { Redlock } from "@sesamecare-oss/redlock";
import { serverConfig } from ".";

export const redis = new Redis(serverConfig.REDIS_URL);

export const redlock = new Redlock([redis], {
  driftFactor: 0.01,
  retryCount: 10,
  retryDelay: 200,
  retryJitter: 100,
});

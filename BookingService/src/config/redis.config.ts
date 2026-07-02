import Redis from "ioredis";
import { Redlock } from "@sesamecare-oss/redlock";
import { serverConfig } from ".";

let redis: Redis | undefined;

export function connectToRedis() {
  if (!redis) {
    redis = new Redis(serverConfig.REDIS_URL);
  }
  return redis;
}

export const redlock = new Redlock([connectToRedis()], {
  driftFactor: 0.01,
  retryCount: 10,
  retryDelay: 200,
  retryJitter: 100,
});

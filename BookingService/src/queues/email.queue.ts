import { Queue } from "bullmq";
import { connectToRedis } from "../config/redis.config";

export const EMAIL_QUEUE_NAME = "email-queue";

export const emailQueue = new Queue(EMAIL_QUEUE_NAME, {
  connection: connectToRedis() as any,
});

import { Queue } from "bullmq";
import { NotificationDTO } from "../dto/notification.dto";
import connectToRedis from "../config/redis.config";

export const EMAIL_QUEUE_NAME = "email-queue";

const emailQueue = new Queue(EMAIL_QUEUE_NAME, {
  connection: connectToRedis(),
});

export const addToEmailQueue = async (
  jobName: string,
  payload: NotificationDTO,
) => {
  await emailQueue.add(jobName, payload);
};

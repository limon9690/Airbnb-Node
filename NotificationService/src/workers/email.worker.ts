import { Worker } from "bullmq";
import connectToRedis from "../config/redis.config";
import { EMAIL_QUEUE_NAME } from "../queues/email.queue";

const connection = connectToRedis();

export const emailWorker = new Worker(
  EMAIL_QUEUE_NAME,
  async (job) => {
    console.log(job.data);
  },
  { connection },
);

emailWorker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

emailWorker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});

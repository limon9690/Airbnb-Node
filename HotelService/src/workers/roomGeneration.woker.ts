import { Worker } from "bullmq";
import connectToRedis from "../config/redis.config";
import { ROOM_GENERATION_QUEUE_NAME } from "../queues/roomGeneration.queue";
import { generateRooms } from "../services/roomGeneration.service";

const connection = connectToRedis();

export const roomGenerationWorker = new Worker(
  ROOM_GENERATION_QUEUE_NAME,
  async (job) => {
    await generateRooms(job.data);
  },
  { connection },
);

roomGenerationWorker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

roomGenerationWorker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});

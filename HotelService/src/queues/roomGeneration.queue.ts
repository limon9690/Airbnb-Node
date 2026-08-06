import { Queue } from "bullmq";
import connectToRedis from "../config/redis.config";
import { RoomGenerationJob } from "../dto/roomGeneration.dto";

export const ROOM_GENERATION_QUEUE_NAME = "room-generation-queue";

const roomGenerationQueue = new Queue(ROOM_GENERATION_QUEUE_NAME, {
  connection: connectToRedis(),
});

export const addToRoomGenerationQueue = async (
  jobName: string,
  payload: RoomGenerationJob,
) => {
  await roomGenerationQueue.add(jobName, payload);
};

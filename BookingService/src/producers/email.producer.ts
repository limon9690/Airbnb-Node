import { NotificationDTO } from "../dto/notification.dto";
import { emailQueue } from "../queues/email.queue";

export const addToEmailQueue = async (
  jobName: string,
  payload: NotificationDTO,
) => {
  await emailQueue.add(jobName, payload);
};

export type NotificationDTO = {
  from: string;
  to: string;
  subject: string;
  templateID: string;
  params: Record<string, any>;
};

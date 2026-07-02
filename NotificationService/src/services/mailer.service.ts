import { resend } from "../config/resend.config";
import { NotificationDTO } from "../dto/notification.dto";
import { InternalServerError } from "../utils/errors/app.error";

export const sendEmail = async (payload: NotificationDTO) => {
  const { from, to, subject, templateID, params } = payload;
  try {
    await resend.emails.send({
      from: from,
      to: [to],
      subject: subject,
      template: {
        id: templateID,
        variables: {
          name: params.name,
        },
      },
    });
  } catch (error: any) {
    throw new InternalServerError(`Failed to send email: ${error.message}`);
  }
};

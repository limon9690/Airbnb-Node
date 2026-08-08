import { resend } from "../config/resend.config";
import { NotificationDTO } from "../dto/notification.dto";
import { InternalServerError } from "../utils/errors/app.error";
import logger from "../config/logger.config";

export const sendEmail = async (payload: NotificationDTO) => {
  const { from, to, subject, templateID, params } = payload;

  let data, error;
  try {
    ({ data, error } = await resend.emails.send({
      from: from,
      to: [to],
      subject: subject,
      template: {
        id: templateID,
        variables: params,
      },
    }));
  } catch (err: any) {
    logger.error(`Failed to send email to ${to}: ${err.message}`, {
      to,
      templateID,
    });
    throw new InternalServerError(`Failed to send email: ${err.message}`);
  }


  if (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`, {
      to,
      templateID,
      resendErrorCode: error.name,
    });
    throw new InternalServerError(`Failed to send email: ${error.message}`);
  }

  logger.info(`Email sent to ${to}`, { to, templateID, resendId: data?.id });
};

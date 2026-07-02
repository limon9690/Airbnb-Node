import { Resend } from "resend";
import { serverConfig } from ".";

export const resend = new Resend(serverConfig.RESEND_API_KEY);

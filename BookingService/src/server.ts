import express from "express";
import { serverConfig } from "./config";
import v1Router from "./routers/index.router";
import {
  appErrorHandler,
  genericErrorHandler,
} from "./middlewares/error.middleware";
import logger from "./config/logger.config";
import { attachCorrelationIdMiddleware } from "./middlewares/correlation.middleware";
import { addToEmailQueue } from "./producers/email.producer";
const app = express();

app.use(express.json());

/**
 * Registering all the routers and their corresponding routes with out app server object.
 */

app.use(attachCorrelationIdMiddleware);
app.use("/api/v1", v1Router);

/**
 * Add the error handler middleware
 */

app.use(appErrorHandler);
app.use(genericErrorHandler);

app.listen(serverConfig.PORT, () => {
  logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
  logger.info(`Press Ctrl+C to stop the server.`);

  addToEmailQueue("sendWelcomeEmail", {
    from: "support@ihlimon.tech",
    to: "limon.hossain26@yahoo.com",
    subject: "Welcome to Airbnb!",
    templateID: "welcome-email",
    params: {
      name: "John Doe",
    },
  });
});

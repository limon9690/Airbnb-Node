import express from "express";
import cookieParser from "cookie-parser";
import { serverConfig } from "./config";
import router from "./routers/v1/index.router";

import {
  appErrorHandler,
  genericErrorHandler,
} from "./middlewares/error.middleware";
import logger from "./config/logger.config";
import { attachCorrelationIdMiddleware } from "./middlewares/correlation.middleware";
import { proxyMiddleware } from "./middlewares/proxy.middleware";
const app = express();

app.use(cookieParser());

/**
 * Registering all the routers and their corresponding routes with out app server object.
 */

app.use(attachCorrelationIdMiddleware);

app.use("/api/v1/auth", express.json(), router);
app.use("/api/v1/hotels", proxyMiddleware(serverConfig.HOTEL_SERVICE_URL));
app.use("/api/v1/bookings", proxyMiddleware(serverConfig.BOOKING_SERVICE_URL));

/**
 * Add the error handler middleware
 */

app.use(appErrorHandler);
app.use(genericErrorHandler);

app.listen(serverConfig.PORT, () => {
  logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
  logger.info(`Press Ctrl+C to stop the server.`);
});

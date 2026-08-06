import express from "express";
import { serverConfig } from "./config";
import {
  appErrorHandler,
  genericErrorHandler,
} from "./middlewares/error.middleware";
import logger from "./config/logger.config";
import { attachCorrelationIdMiddleware } from "./middlewares/correlation.middleware";
import { HotelRouter } from "./routers/hotel.router";
import RoomSchedulerRouter from "./routers/roomScheduler.router";
import { startScheduler } from "./scheduler/roomScheduler";
import "./workers/roomGeneration.woker";
import { roomRouter } from "./routers/room.router";

const app = express();
app.use(express.json());

/**
 * Registering all the routers and their corresponding routes with out app server object.
 */

app.use(attachCorrelationIdMiddleware);
app.use("/api/v1/hotels", HotelRouter);
app.use("/api/v1/scheduler", RoomSchedulerRouter);
app.use("/api/v1/rooms", roomRouter);

/**
 * Add the error handler middleware
 */

app.use(appErrorHandler);
app.use(genericErrorHandler);

app.listen(serverConfig.PORT, () => {
  startScheduler();
  logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
  logger.info("Room availability scheduler initialized");
  logger.info(`Press Ctrl+C to stop the server.`);
});

import { Router } from "express";
import {
  getSchedulerStatusHandler,
  manualExtendAvailabilityHandler,
  startSchedulerHandler,
  stopSchedulerHandler,
} from "../controllers/roomScheduler.controller";
import { auth } from "../middlewares/auth.middleware";
import { AppRole } from "../types/auth.type";

const router = Router();

router.post("/start", auth([AppRole.ADMIN]), startSchedulerHandler);
router.post("/stop", auth([AppRole.ADMIN]), stopSchedulerHandler);
router.get("/status", auth([AppRole.ADMIN]), getSchedulerStatusHandler);
router.post("/extend", auth([AppRole.ADMIN]), manualExtendAvailabilityHandler);

export default router;
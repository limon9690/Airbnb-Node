import { Router } from "express";
import {
  getSchedulerStatusHandler,
  manualExtendAvailabilityHandler,
  startSchedulerHandler,
  stopSchedulerHandler,
} from "../controllers/roomScheduler.controller";

const router = Router();

router.post("/start", startSchedulerHandler);
router.post("/stop", stopSchedulerHandler);
router.get("/status", getSchedulerStatusHandler);
router.post("/extend", manualExtendAvailabilityHandler);

export default router;
import express from "express";
import { UserController } from "../../controllers/user.controller";
import { validateRequestBody } from "../../validators";
import { signInSchema, signUpSchema } from "../../validators/user.validator";
import { auth } from "../../middlewares/auth.middleware";
import { authLimiter } from "../../middlewares/rateLimiter.middleware";
import { AppRole } from "../../../generated/prisma/client";

const router = express.Router();

router.post(
  "/signup",
  authLimiter,
  validateRequestBody(signUpSchema),
  UserController.signUp,
);
router.post(
  "/signin",
  authLimiter,
  validateRequestBody(signInSchema),
  UserController.signIn,
);
router.get("/users", auth([AppRole.ADMIN]), UserController.getAllUsers);

router.get(
  "/me",
  auth([AppRole.USER, AppRole.ADMIN, AppRole.OWNER]),
  UserController.getUserProfile,
);
router.delete(
  "/me",
  auth([AppRole.USER, AppRole.ADMIN, AppRole.OWNER]),
  UserController.deleteUser,
);

export default router;

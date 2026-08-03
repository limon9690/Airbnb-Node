import express from "express";
import { UserController } from "../../controllers/user.controller";
import { validateRequestBody } from "../../validators";
import { signInSchema, signUpSchema } from "../../validators/user.validator";
import { auth } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post(
  "/signup",
  validateRequestBody(signUpSchema),
  UserController.signUp,
);
router.post(
  "/signin",
  validateRequestBody(signInSchema),
  UserController.signIn,
);
router.get("/", UserController.getAllUsers);
router.get("/me", auth, UserController.getUserProfile);
router.delete("/me", auth, UserController.deleteUser);

export default router;

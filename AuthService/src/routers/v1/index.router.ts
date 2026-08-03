import express from "express";
import { UserController } from "../../controllers/user.controller";
import { validateRequestBody } from "../../validators";
import { signInSchema, signUpSchema } from "../../validators/user.validator";

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
router.get("/:id", UserController.getUserById);
router.delete("/:id", UserController.deleteUserById);

export default router;

import express from "express";
import { UserController } from "../../controllers/user.controller";
import { validateRequestBody } from "../../validators";
import { createUserSchema } from "../../validators/user.validator";

const router = express.Router();

router.post(
  "/",
  validateRequestBody(createUserSchema),
  UserController.createUser,
);
router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.delete("/:id", UserController.deleteUserById);

export default router;

import express, { Router } from "express";
import {
  deleteProfile,
  getProfile,
  updateProfile,
  updatePassword
} from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";

import { isAuthenticated } from "../middlewares/user.middleware";
import { updatePasswordSchema, updateProfileSchema } from "../schemas/user.schema";

const router: Router = Router();

router.get("/user", isAuthenticated, getProfile);
router.patch("/update", isAuthenticated, validate(updateProfileSchema), updateProfile);
router.patch("/update/password", isAuthenticated, validate(updatePasswordSchema), updatePassword);
router.delete("/delete", isAuthenticated, deleteProfile);

export default router;

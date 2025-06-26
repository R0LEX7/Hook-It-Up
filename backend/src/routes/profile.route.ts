import express, { Router } from "express";
import {
  deleteProfile,
  getProfile,
  updateProfile,
  updatePassword
} from "../controllers/profile.controller";
import { validate } from "../middlewares/validate.middleware";

import { isAuthenticated } from "../middlewares/user.middleware";
import { updatePasswordSchema, updateProfileSchema } from "../schemas/user.schema";

const router: Router = Router();

router.get("/view", isAuthenticated, getProfile);
router.post("/edit", isAuthenticated, validate(updateProfileSchema , "body"), updateProfile);
router.patch("/password", isAuthenticated, validate(updatePasswordSchema , "body"), updatePassword);
router.delete("/delete", isAuthenticated, deleteProfile);

export default router;

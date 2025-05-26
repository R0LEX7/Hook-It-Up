import express, { Router } from "express";
import { login, signUp } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, signUpSchema } from "../schemas/auth.schema";

const router: Router = express.Router();

router.get("/login", validate(loginSchema , "body"), login);
router.post("/signup", validate(signUpSchema  , "body"), signUp);

export default router;

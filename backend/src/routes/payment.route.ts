import { Router } from "express";
import { isAuthenticated } from "../middlewares/user.middleware";
import {
  createOrder,
  paymentWebHookVerification,
} from "../controllers/payment.controller";

const router: Router = Router();

router.post("/create_order", isAuthenticated, createOrder);
router.post("/webhook", paymentWebHookVerification);

export default router;

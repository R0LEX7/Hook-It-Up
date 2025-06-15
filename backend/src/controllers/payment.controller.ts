import { Response } from "express";
import { asyncHandler } from "../config/asyncHandler";
import { IGetUserAuthInfoRequest, IUser } from "../Interfaces/user.interfaces";
import { paymentInstance } from "../services/payment.service";
import { PaymentModel } from "../models/payment.model";
import { premiumAmount } from "../constants/payment.constant";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";
import { getEnvVar } from "../libs/getEnvVar";
import { IPayment } from "../Interfaces/payment.interfaces";
import { UserModal } from "../models/user.model";

/**
 * 1. POST  Create Order
 * 2. POST WEBHOOK
 */

export const createOrder = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const user = req.user;

    const order = await paymentInstance.orders.create({
      amount: premiumAmount * 100,
      currency: "INR",
      receipt: `${user._id}-${Date.now()}`,
      notes: {
        userId: String(user._id),
        username: user.username,
      },
    });

    const payment = new PaymentModel({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    res
      .status(201)
      .json({ success: true, status: order.status, payment: savedPayment });
  }
);

export const paymentWebHookVerification = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const webHookSignature = req.get("X-Razorpay-Signature");

    if (!webHookSignature) {
      throw new Error("Missing X-Razorpay-Signature header");
    }

    const isWebHookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webHookSignature,
      getEnvVar("PAYMENT_WEBHOOK_SECRET_KEY")
    );

    if (!isWebHookValid) {
      return res
        .status(400)
        .json({ success: false, message: "Webhook signature is invalid" });
    }

    // Update my payment Status in DBAdd commentMore actions
    const entity = req.body?.payload?.payment?.entity;

    if (!entity || !entity.order_id || !entity.status) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid webhook payload structure" });
    }

    const { order_id, status } = entity;

    if (status !== "captured") {
      console.warn("Payment failed or not captured", { order_id, status });
      return res
        .status(400)
        .json({ success: false, message: "payment is not captured" });
    }

    const payment: IPayment | null = await PaymentModel.findOne({
      orderId: order_id,
    });

    if (!payment)
      return res
        .status(400)
        .json({ success: false, message: "Payment not found" });

    if (payment.status === "captured") {
      return res
        .status(200)
        .json({ success: true, message: "Already processed" });
    }

    payment.status = status;
    payment.paymentId = entity.id;
    await payment.save();

    const user: IUser | null = await UserModal.findById(payment.userId);
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    user.isPremium = true;
    await user.save();

    console.log("Received Razorpay Webhook:", req.body);

    return res
      .status(200)
      .json({ success: true, message: "Webhook received successfully" });
  }
);

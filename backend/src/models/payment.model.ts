import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
    signature: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["created", "captured", "failed"],
      default: "created",
    },
    receipt: {
      type: String,
      required: true,
    },
    notes: {
      type: Schema.Types.Mixed, // Razorpay lets you attach key-value notes
    },
  },
  { timestamps: true }
);

export const PaymentModel = mongoose.model("Payment", paymentSchema);

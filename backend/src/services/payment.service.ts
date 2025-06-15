import { IPayment } from './../Interfaces/payment.interfaces';
import { paymentConfig } from './../config/payment.config';
import Razorpay from "razorpay";

import { IGetUserAuthInfoRequest, IUser } from "../Interfaces/user.interfaces";
import { premiumAmount } from "../constants/payment.constant";
import { PaymentModel } from "../models/payment.model";

export const paymentInstance = new Razorpay(paymentConfig);

export const getOrder = async (user: IUser) => {
  const order  = await paymentInstance.orders.create({
    amount: premiumAmount * 100,
    currency: "INR",
    receipt: `${user._id}-${Date.now()}`,
    notes: {
      userId: String(user._id),
      username: user.username,
    },
  });
  return order;
};

export const getPayment = async(req  : IGetUserAuthInfoRequest, order : any) => {
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
    return savedPayment;
}

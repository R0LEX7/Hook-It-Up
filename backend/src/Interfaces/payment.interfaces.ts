import { Document, Types } from "mongoose";

export interface IPayment extends Document {
  orderId: string;
  paymentId?: string;
  username: string;
  signature?: string;
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  currency?: string;
  status: string;
  receipt: string;
  amount: number;
  notes?: {
    [key: string]: any;
  };
  [key: string]: any; // It’s called an index signature in TypeScript
  // This allows you to add any other properties dynamically
}

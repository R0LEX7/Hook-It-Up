import { Document, Types } from "mongoose";
import { IUser } from "./user.interfaces";
import { FinalStatus, InteractionStatus } from "../constants/status.constant";



export interface IConnectionRequest extends Document {
  senderId: Types.ObjectId | IUser;
  receiverId: Types.ObjectId | IUser;
  status: InteractionStatus | FinalStatus;
}

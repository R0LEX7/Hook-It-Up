import { Document, Types } from "mongoose";
import { IUser } from "./user.interfaces";
import { IMessage } from "./message.interface";

export interface IChat extends Document {
  _id: Types.ObjectId;
  members: [IUser | Types.ObjectId];
  lastMessageAt: Date;
  lastMessage: IMessage | Types.ObjectId | null;
  [key: string]: any; // index signature
}

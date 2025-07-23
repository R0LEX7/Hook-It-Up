import { Document, Types } from "mongoose";

export interface IMessage extends Document {
  messageType: string;
  text: string;
  mediaUrl: string;
  password: string;
  senderId: Types.ObjectId;
  chatRoom: Types.ObjectId;
  receiverId: Types.ObjectId;
  isSeen: Boolean;
  isEdited: Boolean;
  isDeleted: Boolean;
  [key: string]: any; // index signature
}

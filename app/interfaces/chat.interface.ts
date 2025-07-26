import { IMessage } from "./message.interface";
import { IUser } from "./user.interface";



export interface IChat  {
  _id: string;
  members: [IUser , IUser]
  lastMessageAt: string;
  lastMessage: IMessage | null;
  [key: string]: any; // index signature
}

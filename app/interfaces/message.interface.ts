import { IChat } from "./chat.interface";


export interface IMessage  {
  messageType: string;
  text: string;
  mediaUrl?: string;
  senderId?: string;
  chatRoom?: string | IChat;
  receiverId?: string;
  isSeen?: boolean;
  isEdited?: boolean;
  isDeleted: boolean;
  [key: string]: any; // index signature
}

import { IChat } from './chat.interface';

// IUser interface for message
interface IUser {
  _id: string;
  username: string;
  profilePic: string;
}

export interface IMessage {
  messageType: string;
  _id: string;
  text: string;
  mediaUrl?: string;
  senderId?:  IUser;
  chatRoom?: string | IChat;
  receiverId?: string;
  isSeen?: boolean;
  isEdited?: boolean;
  isDeleted: boolean;
  [key: string]: any; // index signature
}

export type ImessageType = 'text' | 'image' | 'video';

export interface IMessageDataToBeSent {
  chatRoomId: string;
  senderId: string;
  text?: string;
  mediaUrl?: string;
  messageType: ImessageType;
}

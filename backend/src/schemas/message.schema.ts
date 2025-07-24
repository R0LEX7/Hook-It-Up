import { z } from "zod";
import { MESSAGE_TYPE } from "../constants/chat.constant";



export const getMessagesSchema = z.object({
  chatRoomId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid chatroomId format"),
});

export const editMessageSchema = z.object({
  messageId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid messageId format"),
  editedText: z.string(),
});

export const deleteMessageSchema = z.object({
  messageId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid  format"),
});

export const sendMessageSchema = z.object({
  chatRoomId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid chatRoomId format"),
  senderId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid chatRoomId format"),
  messageType: z.enum(MESSAGE_TYPE, {
    errorMap: () => ({
      message: "message type must be one of these " + MESSAGE_TYPE.join(", "),
    }),
  }),
});

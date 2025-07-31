import { z } from 'zod';

export const sendMessageSchema = z
  .object({
    messageType: z.enum(['text', 'image', 'video']),
    chatRoomId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid chatroomId format'),
    senderId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid senderId format'),
    text: z.string().optional(),
    mediaUrl: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.messageType === 'text') {
        return !!data.text && data.text.trim().length > 0;
      } else {
        return !!data.mediaUrl && data.mediaUrl.trim().length > 0;
      }
    },
    {
      message: 'Invalid message content for the message type',
      path: ['text', 'mediaUrl'], // optional
    }
  );

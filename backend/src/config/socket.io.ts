import { Server as HttpServer } from "http";

import { Socket, Server as SocketIOServer } from "socket.io";
import { corsConfig } from "./cors.config";
import {
  IMessage,
  IMessageDataToBeRecieved,
} from "../Interfaces/message.interface";
import { handleMessageSend } from "../services/message";

export const initializeSocket = (server: HttpServer): SocketIOServer => {
  const io = new SocketIOServer(server, {
    cors: corsConfig(),
  });

  io.on("connection", (socket: Socket) => {
    console.log("✅ Client connected:", socket.id);

    socket.on("join_chat_room", (chatRoomId: string) => {
      socket.join(chatRoomId);
      console.log(`🟢 Joined room: ${chatRoomId}`);
    });

    // Listen for send_message event

    socket.on("send_message", async (data: IMessageDataToBeRecieved) => {
      try {
        const message = await handleMessageSend(data);

        io.to(data.chatRoomId).emit("new_message", message);
        console.log("📩 Message sent to room:", data.chatRoomId);
      } catch (error: any) {
        console.error("❌ Error sending message:", error);
        socket.emit("error_message", {
          message: "Message sending failed",
          error: error.message,
        });
      }
    });
  });

  return io;
};

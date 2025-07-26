import { Server as HttpServer } from "http";

import { Server as SocketIOServer } from "socket.io";
import { corsConfig } from "./cors.config";

export const initializeSocket = (server: HttpServer): SocketIOServer => {
  const io = new SocketIOServer(server, {
    cors: corsConfig(),
  });

  return io;
};

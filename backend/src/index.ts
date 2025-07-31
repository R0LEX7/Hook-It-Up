import dotenv from "dotenv";
dotenv.config();
import { connectToDatabase, corsConfig, initializeSocket } from "./config";
import express, { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import {
  profileRouter,
  authRouter,
  connectionRequestRouter,
  feedRouter,
  paymentRouter,
  chatRouter,
  messageRouter,
} from "./routes";
import cors from "cors";
import { z } from "zod";

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;
connectToDatabase();

const server = createServer(app);

//initializing sockets here
initializeSocket(server);

app.use(cors(corsConfig()));
app.options("*", cors(corsConfig()));
app.use(express.json());

app.get("/hello", (req: Request, res: Response) => {
  res.status(200).json("hello");
});

app.use("/auth", authRouter);
app.use("/feed", feedRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);
app.use("/profile", profileRouter);
app.use("/payment", paymentRouter);
app.use("/connection", connectionRequestRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof z.ZodError) {
    res.status(400).json({ error: "Validation Error", details: err.errors });
    console.log("Error : ", err.errors);
    return;
  } else {
    console.log("Error : ", err);
    res.status(500).json({ error: "Something went wrong!!" });
  }
});

server.listen(PORT, () => {
  console.log("Server listening on port ", PORT);
});

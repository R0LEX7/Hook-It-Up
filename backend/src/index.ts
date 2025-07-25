import dotenv from "dotenv";
dotenv.config();
import { connectToDatabase } from "./config";
import express, { NextFunction, Request, Response } from "express";
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

const allowedOrigins = [
  "http://localhost:8081",
  "http://192.168.1.6:8081",
  "https://your-frontend.com",
];

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // allow
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
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
  }
  console.log("Error : ", err);
  res.status(500).json({ error: "Something went wrong!!" });
});

app.listen(PORT, () => {
  console.log("Server listening on port ", PORT);
});

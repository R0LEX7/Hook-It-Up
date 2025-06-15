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
} from "./routes";
import cors from 'cors'
import { z } from "zod";

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;

connectToDatabase();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

app.get("/hello", (req: Request, res: Response) => {
  res.status(200).json("hello");
});

app.use("/auth", authRouter);
app.use("/feed", feedRouter);
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
  console.log("Server listening on port " , PORT);
});

import { connectToDatabase } from "./config";
import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import {
  profileRouter,
  authRouter,
  connectionRequestRouter,
  feedRouter,
} from "./routes";
import { z } from "zod";
dotenv.config();

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;

connectToDatabase();

app.use(express.json());

app.get("/hello", (req: Request, res: Response) => {
  res.status(200).json("hello");
});

app.use("/auth", authRouter);
app.use("/feed", feedRouter);
app.use("/profile", profileRouter);
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

app.listen(PORT, '0.0.0.0', () => {
  console.log("Server listening on port " , PORT);
});

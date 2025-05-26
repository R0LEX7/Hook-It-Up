import { connectToDatabase } from "./config";
import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { userRouter , authRouter, connectionRequestRouter } from "./routes";
import { z } from "zod";
dotenv.config();

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;

connectToDatabase();

app.use(express.json());


app.get("/", (req: Request, res: Response) => {
  res.send("hello typescript with nodejs");
});

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/connections", connectionRequestRouter);

app.use((err : Error, req : Request, res : Response, next : NextFunction) => {
  if(err instanceof z.ZodError){
    res.status(400).json({error : "Validation Error" , details : err.errors});
    console.log("Error : ", err.errors);
    return;
  }
  console.log("Error : ", err);
  res.status(500).json({ error: "Something went wrong!!" });
});

app.listen(PORT, () => {
  console.log(`server connected to http://localhost:${PORT}`);
});

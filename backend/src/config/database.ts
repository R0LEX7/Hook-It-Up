
import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(String(process.env.MONGO_URI) || "");
    console.log("Database connected successfully!!!");
  } catch (error) {
    console.log(error);
    throw new Error("Database connection refused ");
  }
};

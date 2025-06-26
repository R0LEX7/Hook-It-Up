import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
    },
    gender : {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    bio: {
      type: String,
      default: "Hello there!",
    },
    age: {
      type: Number,
      required: true,
      min: 10,
      max: 100,
    },
    hobbies: {
      type: Array,
      default: [],
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const UserModal = mongoose.model("User", userSchema);

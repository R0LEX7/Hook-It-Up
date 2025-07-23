import mongoose, { model, Schema } from "mongoose";

const chatSchema = new Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

chatSchema.index({ members: 1 });

export const chatModel = model("ChatRoom", chatSchema);

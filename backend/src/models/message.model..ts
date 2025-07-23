import mongoose, { model, Schema } from "mongoose";

const messageSchema = new Schema(
  {
    chatRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },
    text: {
      type: String,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    mediaUrl: {
      type: String,
    },

    messageType: {
      type: String,
      enum: ["text", "image", "video"],
      default: "text",
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    isSeen: {
      type: Boolean,
      default: false,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const messageModel = model("Message", messageSchema);

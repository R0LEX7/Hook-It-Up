import { Response } from "express";
import { asyncHandler } from "../config/asyncHandler";
import { IGetUserAuthInfoRequest, IUser } from "../Interfaces/user.interfaces";
import { chatModel } from "../models/chat.model";
import { UserModal } from "../models/user.model";
import { messageModel } from "../models/message.model.";
import { IMessage } from "../Interfaces/message.interface";
import { IChat } from "../Interfaces/chat.interface";
import { handleMessageSend } from "../services/message";

/**
 * APIS
 * 1. get all  messages
 * 2. send message
 * 3. edit message
 * 4. delete message
 */

const isUserInChatroom = (
  user: IUser,
  res: Response,
  isChatroomExists: IChat
) => {
  const userId = user._id.toString();

  if (!isChatroomExists.members.map((id) => id.toString()).includes(userId)) {
    return res.status(403).json({
      success: false,
      message: "You are forbidden to access this chat",
      data: null,
    });
  }
};

export const getMessages = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const { chatRoomId } = req.params;

    const isChatroomExists: IChat | null = await chatModel.findById(chatRoomId);

    if (!isChatroomExists) {
      return res.status(404).json({
        success: false,
        message: "Chat room isn't exist",
      });
    }
    isUserInChatroom(req.user, res, isChatroomExists);

    const messages = await messageModel
      .find(
        { chatRoom: chatRoomId },
        {
          senderId: 1,
          mediaUrl: 1,
          messageType: 1,
          text: 1,
          createdAt: 1,
          isSeen: 1,
          isEdited: 1,
          isDeleted: 1,
        }
      )
      .populate("senderId", "username profilePic")
      .sort({ createdAt: 1 });

    const unreadCount = await messageModel.countDocuments({
      chatRoom: chatRoomId,
      receiverId: req.user._id,
      isSeen: false,
    });

    return res.status(200).json({
      success: true,
      message: "All messages received",
      data: messages,
      unreadCount,
    });
  }
);

export const sendMessage = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const response = await handleMessageSend({
      chatRoomId: req.body.chatRoomId,
      senderId: req.body.senderId,
      messageType: req.body.messageType,
      text: req.body.text,
      mediaUrl: req.body.mediaUrl,
    });

    return res.status(response.success ? 201 : 400).json(response);
  }
);

export const editMessage = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const { messageId, editedText } = req.body;

    const message = await messageModel
      .findById(messageId)
      .populate("senderId", "username profilePic _id")
      .populate("receiverId", "username profilePic _id");

    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "message not found", data: null });
    }
    const user = req.user;
    if (!message.senderId.equals(user._id)) {
      return res.json(403).json({
        success: false,
        message: "User is not the sender of message",
        data: null,
      });
    }

    if (message.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Message is deleted already",
        data: null,
      });
    }

    message.text = editedText;
    message.isEdited = true;
    await message.save();

    return res.status(201).json({
      success: true,
      message: "message edited successfully",
      data: message,
    });
  }
);

export const deleteMessage = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const { messageId } = req.params;
    console.log("deleting id ", messageId);

    const message = await messageModel
      .findById(messageId)
      .populate("senderId", "username profilePic _id")
      .populate("receiverId", "username profilePic _id");

    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "message not found", data: null });
    }
    const user = req.user;
    if (!message.senderId.equals(user._id)) {
      return res.status(403).json({
        success: false,
        message: "User is not the sender of message",
        data: null,
      });
    }

    message.text = "";
    message.isDeleted = true;
    await message.save();

    console.log("deleted message ", message);

    return res.status(201).json({
      success: true,
      message: "message deleted successfully",
      data: message,
    });
  }
);

export const seenMessage = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const { chatRoomId } = req.body;

    const chatRoom: IChat | null = await chatModel.findById(chatRoomId);

    if (!chatRoom) {
      return res
        .status(404)
        .json({ success: false, message: "chat room not found" });
    }
    const user = req.user;

    if (!chatRoom?.members.includes(user._id)) {
      return res.status(403).json({
        success: false,
        message: "User is not the receiver of message",
      });
    }

    await messageModel.updateMany(
      {
        chatRoom: chatRoomId,
        receiverId: user._id,
        isSeen: false,
      },
      { isSeen: true }
    );

    return res
      .status(200)
      .json({ success: true, message: "Messages marked as seen" });
  }
);

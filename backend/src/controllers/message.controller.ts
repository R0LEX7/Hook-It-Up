import { Response } from "express";
import { asyncHandler } from "../config/asyncHandler";
import { IGetUserAuthInfoRequest } from "../Interfaces/user.interfaces";
import { chatModel } from "../models/chat.model";
import { UserModal } from "../models/user.model";
import { messageModel } from "../models/message.model.";
import { IMessage } from "../Interfaces/message.interface";

/**
 * APIS
 * 1. get all  messages
 * 2. send message
 * 3. edit message
 * 4. delete message
 */

export const getMessages = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const { chatRoomId } = req.params;

    const isChatroomExists = await chatModel.findById(chatRoomId);

    if (!isChatroomExists) {
      return res.status(404).json({
        success: false,
        message: "Chat room isn't exist",
      });
    }

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
      unreadCount
    });
  }
);

export const sendMessage = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const { chatRoomId, senderId, messageType } = req.body;

    const isChatroomExists = await chatModel.findById(chatRoomId);

    if (!isChatroomExists) {
      return res.status(404).json({
        success: false,
        message: "Chat room isn't exist",
      });
    }

    const isSenderExists = await UserModal.findById(senderId);

    if (!isSenderExists) {
      return res
        .status(404)
        .json({ success: false, message: "sender not exists" });
    }

    const user = req.user;

    const messageBody =
      messageType === "text"
        ? { text: req.body.text }
        : { mediaUrl: req.body.mediaUrl };

    const receiverId = isChatroomExists.members.find(
      (id) => id.toString() !== senderId.toString()
    );

    const message = new messageModel({
      chatRoom: chatRoomId,
      receiverId,

      messageType,
      ...messageBody,
      senderId: user._id,
    });

    await message.save();

    isChatroomExists.lastMessage =
      messageType === "text" ? req.body.text : "open to see attachment";

    isChatroomExists.lastMessageAt = new Date();

    await isChatroomExists.save();
    return res
      .status(201)
      .json({ success: true, message: "Message send successfully" });
  }
);

export const editMessage = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const { messageId, editedText } = req.body;

    const message: IMessage | null = await messageModel.findById(messageId);

    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "message not found" });
    }
    const user = req.user;
    if (!message.senderId.equals(user._id)) {
      return res
        .json(403)
        .json({ success: false, message: "User is not the sender of message" });
    }

    if (message.isDeleted) {
      return res
        .status(400)
        .json({ success: false, message: "Message is deleted already" });
    }

    message.text = editedText;
    message.isEdited = true;
    await message.save();

    return res
      .status(201)
      .json({ success: true, message: "message edited successfully" });
  }
);

export const deleteMessage = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const { messageId } = req.body;

    const message: IMessage | null = await messageModel.findById(messageId);

    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "message not found" });
    }
    const user = req.user;
    if (!message.senderId.equals(user._id)) {
      return res
        .status(403)
        .json({ success: false, message: "User is not the sender of message" });
    }

    message.text = "";
    message.isDeleted = true;
    await message.save();

    return res
      .status(201)
      .json({ success: true, message: "message deleted successfully" });
  }
);

export const seenMessage = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const { messageId } = req.body;

    const message: IMessage | null = await messageModel.findById(messageId);

    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "message not found" });
    }
    const user = req.user;
    if (!message.receiverId.equals(user._id)) {
      return res
        .status(403)
        .json({
          success: false,
          message: "User is not the receiver of message",
        });
    }

    message.isSeen = true;
    await message.save();

    return res
      .status(201)
      .json({ success: true, message: "message seen successfully" });
  }
);

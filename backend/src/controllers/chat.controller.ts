import { Response } from "express";
import { asyncHandler } from "../config/asyncHandler";
import { IGetUserAuthInfoRequest } from "../Interfaces/user.interfaces";
import { chatModel } from "../models/chat.model";
import { UserModal } from "../models/user.model";
import { USER_POP_CONST } from "../constants/user.constant";
import { connectionRequestModel } from "../models/connectionRequest.model";
import { IConnectionRequest } from "../Interfaces/connectionRequest.interfaces";
import { FINAL_STATUSES } from "../constants/status.constant";
import { messageModel } from "../models/message.model.";

/**
 * 1 create chat
 * 2 getChats
 */

export const getChats = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {

    const chatRooms = await chatModel
      .find({
        members: { $all: req.user._id }
      } ,  {
          members : 1, lastMessage : 1 , lastMessageAt : 1
        })
      .populate("members", "username profilePic isPremium age")

    return res.status(200).json({
      success: true,
      message: "All chats fetched",
      data: chatRooms,
      count : chatRooms.length
    });
  }
);

export const createChat = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const { memberIds } = req.body;

    //  Validate that exactly two member IDs are provided
    if (!Array.isArray(memberIds) || memberIds.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Exactly two member IDs are required",
      });
    }

    //  Check that both users exist in the database
    const isMemberExists = await UserModal.find({
      $or: [{ _id: memberIds[0] }, { _id: memberIds[1] }],
    });

    if (isMemberExists.length !== memberIds.length) {
      return res
        .status(400)
        .json({ success: false, message: "One or more users do not exist" });
    }

    //  Check if there is a connection request between both users
    const connection: IConnectionRequest | null =
      await connectionRequestModel.findOne({
        $or: [
          { senderId: memberIds[0], receiverId: memberIds[1] },
          { senderId: memberIds[1], receiverId: memberIds[0] },
        ],
      });

    //  Ensure a connection exists between the two users
    if (!connection) {
      return res
        .status(400)
        .json({ success: false, message: "Connection is not exist" });
    }

    //  Ensure the connection is in an accepted/final state
    if (connection.status !== FINAL_STATUSES[0]) {
      return res.status(400).json({
        success: false,
        message: "user is not accepted your request yet",
      });
    }

    //  Ensure the authenticated user is one of the chat members
    if (!memberIds.includes(req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this chat",
      });
    }

    //  Check if a chatroom between these two users already exists
    const isChatroomExists = await chatModel
      .findOne({
        members: { $all: memberIds },
        $expr: { $eq: [{ $size: "$members" }, 2] },
      })
      .populate("members", "username profilePic isPremium age");

    if (isChatroomExists) {
      return res.status(200).json({
        success: true,
        message: "Chat room already exists",
        data: isChatroomExists,
      });
    }

    //  Create and save the new chat room
    const chatRoom = await new chatModel({ members: memberIds }).save();
    const populatedChat = await chatModel
      .findById(chatRoom._id)
      .populate("members", "username profilePic isPremium age");

    return res.status(201).json({
      success: true,
      message: "Chatroom created Successfully",
      data: populatedChat,
    });
  }
);

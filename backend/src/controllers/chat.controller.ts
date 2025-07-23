import { Response } from "express";
import { asyncHandler } from "../config/asyncHandler";
import { IGetUserAuthInfoRequest } from "../Interfaces/user.interfaces";
import { chatModel } from "../models/chat.model";
import { UserModal } from "../models/user.model";
import { USER_POP_CONST } from "../constants/user.constant";

export const createChat = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const { memberIds } = req.body;

    if (!Array.isArray(memberIds) || memberIds.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Exactly two member IDs are required",
      });
    }

    const isMemberExists = await UserModal.find({
      $or: [{ _id: memberIds[0] }, { _id: memberIds[1] }],
    });

    if (isMemberExists.length !== memberIds.length) {
      return res
        .status(400)
        .json({ message: "One or more users do not exist" });
    }

    const isChatroomExists = await chatModel.findOne({
      members: { $all: memberIds },
      $expr: { $eq: [{ $size: "$members" }, 2] }, //to insure there is only 2 users
    });

    if (isChatroomExists) {
      return res.status(200).json({
        success: true,
        message: "Chat room already exists",
      });
    }

    const chatRoom = new chatModel({ members: memberIds });

    await chatRoom.save();

    return res
      .status(201)
      .json({ success: true, message: "Chatroom created Successfully" });
  }
);

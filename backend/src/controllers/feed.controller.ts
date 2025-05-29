import { Response } from "express";
import { asyncHandler } from "../config/asyncHandler";
import { IGetUserAuthInfoRequest } from "../Interfaces/user.interfaces";
import { connectionRequestModel } from "../models/connectionRequest.model";
import { UserModal } from "../models/user.model";
import { USER_QUERY_CONST } from "../constants/user.constant";
import { Types } from "mongoose";

export const getFeed = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const loggedUserId: Types.ObjectId = req.user._id;

    const limit: number = Number(req.query.limit) || 10;
    const page: number = Number(req.query.page) || 1;
    const skip: number = (page - 1) * limit;

    const connections = await connectionRequestModel
      .find(
        { $or: [{ senderId: loggedUserId }, { receiverId: loggedUserId }] },
        { senderId: 1, receiverId: 1, _id: 0 }
      )


    let connectedUserIds = new Set<string>();

    connections.forEach((con) => {
      let senderId = String(con.senderId),
        receiverId = String(con.receiverId);
      if (!connectedUserIds.has(senderId)) connectedUserIds.add(senderId);
      if (!connectedUserIds.has(receiverId)) connectedUserIds.add(receiverId);
    });
    connectedUserIds.add(String(loggedUserId));

    const excludedIds = Array.from(connectedUserIds);

    let feedUsers = await UserModal.find(
      { _id: { $nin: excludedIds } },
      USER_QUERY_CONST
    ).skip(skip)
      .limit(limit).lean();

    return res.json({
      success: true,
      page,
      limit,
      count: feedUsers.length,
      hasMore: feedUsers.length === limit,
      data: feedUsers,
    });
  }
);

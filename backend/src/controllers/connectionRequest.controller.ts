import { connectionRequestModel } from "./../models/connectionRequest.model";
import { Response } from "express";
import { asyncHandler } from "../config/asyncHandler";
import { IGetUserAuthInfoRequest } from "../Interfaces/user.interfaces";

/**
 * Connection Request apis
 * 1. GET connection request
 * 2 . GET connections
 * 3. POST interested
 * 4. POST ignored
 * 5. POST accepted
 * 6. POST rejected
 */

//  GET connection request
const reqStatus = ["interested", "ignored"];

export const fetchConnectionRequests = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const user = req.user;

    const allRequests = await connectionRequestModel
      .find({
        status: { $in: reqStatus },
        $or: [{ senderId: user._id }, { receiverId: user._id }],
      })
      .populate("senderId", "username firstName lastName age")
      .populate("receiverId", "username firstName lastName age");

    res.status(200).json({
      success: true,
      message: "Connections fetched",
      count: allRequests.length,
      allRequests,
    });
  }
);

//  GET connections
export const fetchConnections = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const user = req.user;

    const allAcceptedConnections = await connectionRequestModel
      .find({
        status: { $nin: reqStatus },
        $or: [{ senderId: user._id }, { receiverId: user._id }],
      })
      .populate("senderId", "username firstName lastName age")
      .populate("receiverId", "username firstName lastName age");

    res.status(200).json({
      success: true,
      message: "Connections fetched",
      count: allAcceptedConnections.length,
      allAcceptedConnections,
    });
  }
);

//  POST interested/ignored
export const sendConnectionRequest = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const user = req.user;
    const status = req.params.status as "interested" | "ignored",
      receiverId = req.params.userId;

    if (user._id.toString() === receiverId) {
      return res
        .status(400)
        .json({ message: "You cannot send a request to yourself." });
    }

    const isRequestExist = await connectionRequestModel.findOne({
      $or: [
        { senderId: user._id, receiverId },
        { receiverId: user._id, senderId: receiverId },
      ],
    });

    if (isRequestExist) {
      isRequestExist.status = status;
      await isRequestExist.save();
      return res.status(201).json({
        data: isRequestExist,
        message: `${status} is changed to the user`,
      });
    }

    const connectionRequest = new connectionRequestModel({
      senderId: user._id,
      status,
      receiverId,
    });

    const data = await connectionRequest.save();

    res
      .status(201)
      .json({ data: data, message: `${status} is sent to the user` });
  }
);

//  POST accepted or rejected
export const reviewConnectionRequest = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const reqId = req.params.reqId,
      status = req.params.status as "accepted" | "rejected";

    const connectionReq = await connectionRequestModel.findById(reqId);

    if (!connectionReq) {
      res.status(404).json({ message: "Connection not found" });
      return;
    }

    connectionReq.status = status;

    const data = await connectionReq.save();

    res
      .status(201)
      .json({ data: data, message: `${status} is sent to the user` });
    return;
  }
);

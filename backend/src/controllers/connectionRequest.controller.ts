import { USER_POP_CONST, USER_QUERY_CONST } from "./../constants/user.constant";
import { connectionRequestModel } from "./../models/connectionRequest.model";
import { Response } from "express";
import { asyncHandler } from "../config/asyncHandler";
import { IGetUserAuthInfoRequest, IUser } from "../Interfaces/user.interfaces";
import {
  FINAL_STATUSES,
  INTERACTION_STATUSES,
} from "../constants/status.constant";
import { IConnectionRequest } from "../Interfaces/connectionRequest.interfaces";
import { UserModal } from "../models/user.model";
import { run } from "../services/email.service";
import { Types } from "mongoose";

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
const reqStatus = "interested";
const conStatus = "accepted";

function isPopulatedUser(user: Types.ObjectId | IUser): user is IUser {
  return typeof user === "object" && "username" in user;
}

export const requests = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const user = req.user;

    const allRequests = await connectionRequestModel
      .find({
        status: reqStatus,
         receiverId: user._id,
      })
      .populate("senderId", USER_POP_CONST)
      .populate("receiverId", USER_POP_CONST);

    const requests = allRequests
      .map((request) => {
        const sender = request.senderId;
        const receiver = request.receiverId;
        const reqId = request._id;

        if (isPopulatedUser(sender) && isPopulatedUser(receiver)) {
          if (sender._id.equals(user._id)) {
            return { ...receiver.toObject(), reqId };
          } else {
            return { ...sender.toObject(), reqId };
          }
        }

        return null; // fallback, should never hit if populate works
      })
      .filter(Boolean); // remove nulls

    res.status(200).json({
      success: true,
      message: "Connections fetched",
      count: allRequests.length,
      allRequests,
      requests,
    });
  }
);

//  GET connections
export const connections = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const user = req.user;

    const allAcceptedConnections = await connectionRequestModel
      .find({
        status: conStatus,
        $or: [{ senderId: user._id }, { receiverId: user._id }],
      })
      .populate("senderId", USER_POP_CONST)
      .populate("receiverId", USER_POP_CONST);

    const matchesSet = new Set();

    allAcceptedConnections.forEach((connection) => {
      const sender = connection.senderId;
      const receiver = connection.receiverId;

      if (sender._id.equals(user._id)) {
        matchesSet.add(receiver);
      } else if (receiver._id.equals(user._id)) {
        matchesSet.add(sender);
      }
    });

    const matches = new Array(...matchesSet);
    res.status(200).json({
      success: true,
      message: "Connections fetched",
      count: allAcceptedConnections.length,
      allAcceptedConnections,
      matches: matches,
    });
  }
);

//  POST interested/ignored
export const sendConnectionRequest = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const user = req.user;
    const status = req.params.status as "interested" | "ignored",
      receiverId = req.params.userId;

    let receiver = await UserModal.findById(receiverId);

    if (!receiver)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user._id.equals(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a request to yourself.",
      });
    }

    const isRequestExist: IConnectionRequest | null =
      await connectionRequestModel
        .findOne({
          $or: [
            { senderId: user._id, receiverId },
            { receiverId: user._id, senderId: receiverId },
          ],
        })
        .populate("receiverId", "username");

    if (isRequestExist) {
      return res.status(200).json({
        success: false,
        data: isRequestExist,
        message: `${isRequestExist.status} is already set for ${receiver.username}\n You cannot change the status now`,
      });
    }

    const connectionRequest: IConnectionRequest = new connectionRequestModel({
      senderId: user._id,
      status,
      receiverId,
    });

    const savedRequest = await connectionRequest.save();

    const populatedRequest = await connectionRequestModel
      .findById(savedRequest._id)
      .populate("receiverId", USER_POP_CONST)
      .populate("senderId", USER_POP_CONST);

    // const emailRes = await run();

    // console.log("email response -> ", emailRes);

    res.status(201).json({
      success: true,
      data: populatedRequest,
      message: `${status} is sent to the user ${receiver.username}`,
    });
  }
);

//  POST accepted or rejected
export const reviewConnectionRequest = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const reqId = req.params.reqId,
      status = req.params.status as "accepted" | "rejected",
      user = req.user;

    const connectionReq: IConnectionRequest | null =
      await connectionRequestModel
        .findById(reqId)
        .populate("receiverId", "username");

    if (!connectionReq) {
      res.status(404).json({ success: false, message: "Connection not found" });
      return;
    }

    const receiver = connectionReq.receiverId as IUser;

    /* if status is already accepted by the  you cant change it */
    if (connectionReq?.status === status)
      return res.status(409).json({
        success: true,
        message: `You are already ${status} this request`,
      });

    /* if status is not interested by the other you cant change it */
    if (connectionReq?.status !== INTERACTION_STATUSES[0])
      return res.status(400).json({
        success: false,
        message: `You cant change the status  by the user ${receiver?.username} anymore`,
      });

    if (!connectionReq?.receiverId._id.equals(user._id))
      return res
        .status(403)
        .json({ success: false, message: "You are not authorized" });

    connectionReq.status = status;

    const data = await connectionReq.save();

    res.status(200).json({
      success: true,
      data: data,
      message: `${status} is sent to the user ${receiver?.username} `,
    });
    return;
  }
);

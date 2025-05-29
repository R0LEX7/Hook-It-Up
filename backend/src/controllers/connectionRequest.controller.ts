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

export const requests = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const user = req.user;

    const allRequests = await connectionRequestModel
      .find({
        status: reqStatus,
        $or: [{ senderId: user._id }, { receiverId: user._id }],
      })
      .populate("senderId", USER_POP_CONST)
      .populate("receiverId", USER_POP_CONST);

    res.status(200).json({
      success: true,
      message: "Connections fetched",
      count: allRequests.length,
      allRequests,
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

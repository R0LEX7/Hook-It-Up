import { IUser } from "./../Interfaces/user.interfaces";
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../config/asyncHandler";
import { JwtPayload, verify } from "jsonwebtoken";
import { jwtSecret } from "../controllers/auth.controller";
import { UserModal } from "../models/user.model";
import { IGetUserAuthInfoRequest } from "../Interfaces/user.interfaces";
import { USER_QUERY_CONST } from "../constants/user.constant";

export const isAuthenticated = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res, next) => {
    const authHeader = req.header("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    let isVerifiedUser: JwtPayload;
    try {
      isVerifiedUser = verify(token, jwtSecret) as JwtPayload;
    } catch (err) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }

    if (!isVerifiedUser?.id) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid token payload" });
    }

    const user: IUser | null = await UserModal.findById(isVerifiedUser.id ,USER_QUERY_CONST );
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    req.user = user;
    next();
  }
);

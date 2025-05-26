
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../config/asyncHandler";
import { JwtPayload, verify } from "jsonwebtoken";
import { jwtSecret } from "../controllers/auth.controller";
import { UserModal } from "../models/user.model";
import { IGetUserAuthInfoRequest } from "../Interfaces/user.interfaces";



export const isAuthenticated = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res, next) => {

    const authHeader = req.header('authorization');

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const isVerifiedUser = verify(token, jwtSecret) as JwtPayload;

    const user = await UserModal.findById(isVerifiedUser.id);
    if (!user) throw new Error("User not found");

    req.user = user;
    next();
  }
);

import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../config/asyncHandler";
import { IGetUserAuthInfoRequest, IUser } from "../Interfaces/user.interfaces";
import { hash, verify } from "argon2";

/**
 * profile apis
 * 1. GET profile
 * 2. PATCH update profile
 * 3. PATCH update password
 * 4. DELETE profile
 * 5. GET feed
 */

// get user

export const getProfile = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const user = req.user;

    res.status(200).json({ success: true, user: user });
  }
);

//  update profile
export const updateProfile = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const updateFields = [
      "firstName",
      "lastName",
      "age",
      "bio",
      "username",
      "hobbies",
      "profilePic",
    ];

    const isUpdateValid = Object.keys(req.body).every((key) =>
      updateFields.includes(key)
    );

    if (!isUpdateValid || !req.body) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid update fields" });
    }

    let user = req.user;
    if (!user || user === undefined)
      return res
        .status(401)
        .json({ success: false, message: "User not found" });

    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));

    await user.save();
    if (!user)
      res.status(401).json({ success: false, message: `user doesn't exists` });

    res
      .status(200)
      .json({
        success: true,
        message: "User updated successfully",
        user: user,
      });
  }
);

// update password

export const updatePassword = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const { oldPassword, newPassword } = req.body;

    const user = req.user;

    const isUserValid = await verify(user.password, oldPassword);

    if (!isUserValid)
      res
        .status(401)
        .json({ success: false, message: "Password doesn`t match" });

    const hashedPassword = await hash(newPassword);
    user.password = hashedPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  }
);

// delete user
export const deleteProfile = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {
    const user = req.user;

    user.remove();

    res.status(204).json({
      success: true,
      message: `${user?.username} deleted Successfully`,
    });
  }
);

export const getUserFeed = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {}
);

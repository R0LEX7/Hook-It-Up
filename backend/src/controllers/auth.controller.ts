import { asyncHandler } from "../config/asyncHandler";
import { Request, Response } from "express";
import { UserModal } from "../models/user.model";
import { hash, verify } from "argon2";
import { sign } from "jsonwebtoken";
import { IUser } from "../Interfaces/user.interfaces";

/**
 * USER APIS
 * 1. POST signup
 * 2. POST login
 */

export const jwtSecret: string = process.env.JWT_KEY || "abc";

// sign up
export const signUp = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, username, password, age, gender, hobbies, bio } =
    req.body;

  const isUserExist = await UserModal.findOne({ username });

  if (isUserExist) {
    console.log("username already exist");
    return res
      .status(401)
      .json({ success: false, message: `username ${username} already exists` });
  }

  const hashedPassword: string = await hash(password);
  const user = new UserModal({
    firstName,
    lastName,
    username,
    age,
    gender,
    bio: bio || "Hello There!",
    hobbies: hobbies ? hobbies : [],
    password: hashedPassword,
  });

  const savedUser = await user.save();

  const { password: _, ...userWithoutPassword } = savedUser.toObject();
  res.status(201).json({
    success: true,
    user: userWithoutPassword,
    message: "User saved successfully",
  });
  return;
});

// login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user: IUser | null = await UserModal.findOne({ username });
  if (!user) {
    res.status(401).json({ message: `Invalid Credentials` });
    return;
  }

  // compare password
  const isVerifiedUser: boolean = await verify(user.password, password);

  if (!isVerifiedUser)
    return res.status(401).json({ message: `Invalid Credentials` });

  // token creation
  const token: string = sign({ id: user._id }, jwtSecret);
  console.log("token :", token);

  const data = await UserModal.collection.getIndexes();

  console.log("index data -> ", data);

  return res
    .status(200)
    .json({ message: `${user?.username} login Successfully`, token: token });
});

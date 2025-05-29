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
  const { firstName, lastName, username, password  , age} = req.body;

  const hashedPassword: string = await hash(password);
  const user = new UserModal({
    firstName,
    lastName,
    username,
    age,
    password: hashedPassword,
  });

  const savedUser = await user.save();




  res.status(201).json({ user: savedUser, message: "User Saved Successfully" });
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

  if (!isVerifiedUser) return  res.status(401).json({ message: `Invalid Credentials` });

  // token creation
  const token: string = sign({ id: user._id }, jwtSecret);
  console.log("token :" , token);

  const data = await UserModal.collection.getIndexes();

  console.log("index data -> " ,data);

  return res.status(200).json({ message: `${user?.username} login Successfully` , token : token });
});

import { Document , Types } from 'mongoose';
import { Request } from "express";



export interface IGetUserAuthInfoRequest extends Request {
  user:  IUser
  body: {
    [key: string]: any; // It’s called an index signature in TypeScript
  };
}

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    _id: Types.ObjectId ;
    age : number,
    bio?: string;
  hobbies?: string[];
  [key: string]: any; // It’s called an index signature in TypeScript
  // This allows you to add any other properties dynamically
  }

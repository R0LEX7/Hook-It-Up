import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { asyncHandler } from "../config/asyncHandler";
import { IGetUserAuthInfoRequest } from "../Interfaces/user.interfaces";

export const validate = (schema: z.ZodSchema , source :"body" | "params" |"query" = "body") => {
  return asyncHandler<IGetUserAuthInfoRequest>((req , res : Response , next : NextFunction) => {
    schema.parse(req[source]);
    next()
  })
};

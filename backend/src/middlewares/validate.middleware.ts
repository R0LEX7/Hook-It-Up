
import { ZodSchema } from "zod";
import { asyncHandler } from "../config/asyncHandler";
import { IGetUserAuthInfoRequest } from "../Interfaces/user.interfaces";
import { Response, NextFunction } from "express";

export enum RequestPart {
  BODY = "body",
  PARAMS = "params",
  QUERY = "query",
}

export const validate = (
  schema: ZodSchema,
  source: RequestPart = RequestPart.BODY
) => {
  return asyncHandler<IGetUserAuthInfoRequest>(
    (req, res: Response, next: NextFunction) => {
      schema.parse(req[source]);
      next();
    }
  );
};

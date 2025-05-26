import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { asyncHandler } from "../config/asyncHandler";

export const validate = (schema: z.ZodSchema) => {
  return asyncHandler((req: Request, res: Response, next: NextFunction) => {
    schema.parse(req.body);
    next();
  });
};

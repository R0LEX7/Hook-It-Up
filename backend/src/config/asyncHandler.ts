import { Request, Response, NextFunction } from "express";

export const asyncHandler = <T = Request>
  (fn: (req: T, res: Response, next: NextFunction) => void) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as T, res, next)).catch(next);
  };

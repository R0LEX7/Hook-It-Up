import z from "zod";
import { FINAL_STATUSES, INTERACTION_STATUSES } from "../constants/status.constant";

export const requestSchema = z.object({
  status: z.enum(INTERACTION_STATUSES, {
    errorMap: () => ({
      message: "status must be either interested or ignored",
    }),
  }),
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid userId format"),
});

export const reviewSchema = z.object({
  status: z.enum(FINAL_STATUSES, {
    errorMap: () => ({
      message: "status must be either interested or ignored",
    }),
  }),
  reqId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid userId format"),
});

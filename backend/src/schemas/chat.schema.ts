import { z } from "zod";

export const chatSchema = z.object({
  memberIds: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid userId format"))
    .length(2, { message: "Exactly 2 memberIds are required" }),
});

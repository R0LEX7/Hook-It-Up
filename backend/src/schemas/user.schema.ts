import { z } from "zod";


export const updatePasswordSchema = z.object({
    oldPassword: z.string().min(8, "Old password must be at least 8 characters").max(32),
    newPassword: z.string().min(8, "New password must be at least 8 characters").max(32),
})

export const updateProfileSchema = z.object({
      firstName: z
        .string()
        .nonempty("firstName is required")
        .refine(
          (value) => /^[a-zA-Z]+$/.test(value),
          "firstName can only contain letters"
        ).optional(),
      lastName: z
        .string()
        .nonempty("lastName is required")
        .refine(
          (value) => /^[a-zA-Z]+$/.test(value),
          "firstName can only contain letters"
        ).optional(),
      username: z
        .string()
        .nonempty("Username is required")
        .refine(
          (value) => /^[a-zA-Z0-9_]+$/.test(value),
          "Username can only contain letters, numbers, and underscores (_)"
        ).optional(),

      age : z.number().min(10 , "Age must be above 10 years old").max(100).optional(),
      bio : z.string().optional(),
      hobbies : z.array(z.string()).optional()
})

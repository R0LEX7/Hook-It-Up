import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z
    .string()
    .nonempty("firstName is required")
    .refine(
      (value) => /^[a-zA-Z]+$/.test(value),
      "firstName can only contain letters"
    ),
  lastName: z
    .string()
    .nonempty("lastName is required")
    .refine(
      (value) => /^[a-zA-Z]+$/.test(value),
      "firstName can only contain letters"
    ),
  username: z
    .string()
    .nonempty("Username is required")
    .refine(
      (value) => /^[a-zA-Z0-9_]+$/.test(value),
      "Username can only contain letters, numbers, and underscores (_)"
    ),
  password: z.string().min(8, "Password must be at least 8 characters").max(32),
  age : z.number({ required_error: "Age is required" }).min(10 , "Age must be above 10 years old").max(99)
});

export const loginSchema = z.object({
  username: z
    .string()
    .nonempty("Username is required")
    .refine(
      (value) => /^[a-zA-Z0-9_]+$/.test(value),
      "Username can only contain letters, numbers, and underscores (_)"
    )
  ,
  password: z.string().min(8, "Password must be at least 8 characters").max(32),
});

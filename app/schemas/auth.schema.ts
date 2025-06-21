import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z.string().min(1, 'Username is required'),
  age: z.preprocess(
    (val) => Number(val),
    z.number().min(10, 'Age must be 10 or above'),
  ),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

import { z } from 'zod';

export const profileSchema = z.object({
  firstName: z
    .string()
    .nonempty('firstName is required')
    .refine(
      (value) => /^[a-zA-Z]+$/.test(value),
      'firstName can only contain letters',
    ),
  lastName: z
    .string()
    .nonempty('lastName is required')
    .refine(
      (value) => /^[a-zA-Z]+$/.test(value),
      'firstName can only contain letters',
    ),
  bio: z.string(),
  hobbies: z.array(z.string()).max(4),
  age: z
    .number({ required_error: 'Age is required' })
    .min(10, 'Age must be above 10 years old')
    .max(99),
});

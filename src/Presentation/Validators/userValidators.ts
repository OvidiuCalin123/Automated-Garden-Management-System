import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  age: z.number().int().min(1).max(150),
  emailAddress: z.email().max(255),
});

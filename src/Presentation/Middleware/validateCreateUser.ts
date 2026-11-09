import type { Request, Response, NextFunction } from "express";
import { createUserSchema } from "../Validators/userValidators.js";

export const validateCreateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = createUserSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: "Invalid request body",
      errors: result.error.issues,
    });
    return;
  }

  req.body = result.data;
  next();
};

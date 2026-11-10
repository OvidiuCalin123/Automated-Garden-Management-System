import type { Request, Response, NextFunction } from "express";
import { createGardenSchema } from "../Validators/gardenValidators.js";

export const validateCreateGarden = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = createGardenSchema.safeParse(req.body);

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

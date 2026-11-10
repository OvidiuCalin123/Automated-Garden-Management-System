import type { Request, Response, NextFunction } from "express";
import { createPlantSchema } from "../Validators/plantValidators.js";

export const validateCreatePlant = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = createPlantSchema.safeParse(req.body);

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

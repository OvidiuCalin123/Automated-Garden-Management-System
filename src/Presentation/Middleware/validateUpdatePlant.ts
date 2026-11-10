import type { Request, Response, NextFunction } from "express";
import { updatePlantSchema } from "../Validators/plantValidators.js";

export const validateUpdatePlant = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = updatePlantSchema.safeParse(req.body);

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

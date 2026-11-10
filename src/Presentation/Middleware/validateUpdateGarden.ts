import type { Request, Response, NextFunction } from "express";
import { updateGardenSchema } from "../Validators/updateGardenValidator.js";

export const validateUpdateGarden = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = updateGardenSchema.safeParse(req.body);

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

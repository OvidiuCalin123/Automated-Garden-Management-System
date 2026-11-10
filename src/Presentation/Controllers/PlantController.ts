import type { Request, Response, NextFunction } from "express";
import { CreatePlantService } from "../../Application/Services/CreatePlantService.js";

export class PlantController {
  constructor(private readonly createPlantService: CreatePlantService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gardenId = Array.isArray(req.params.gardenId)
        ? req.params.gardenId[0]
        : req.params.gardenId;

      const plant = await this.createPlantService.execute({
        ...req.body,
        gardenId,
      });

      res.status(201).json(plant);
    } catch (error) {
      next(error);
    }
  };
}

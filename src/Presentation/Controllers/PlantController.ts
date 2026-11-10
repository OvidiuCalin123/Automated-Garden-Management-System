import type { Request, Response, NextFunction } from "express";

import { CreatePlantService } from "../../Application/Services/CreatePlantService.js";
import { GetGardenPlantsService } from "../../Application/Services/GetGardenPlantsService.js";
import { GetPlantService } from "../../Application/Services/GetPlantService.js";

export class PlantController {
  constructor(
    private readonly createPlantService: CreatePlantService,
    private readonly getGardenPlantsService: GetGardenPlantsService,
    private readonly getPlantService: GetPlantService,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Array.isArray(req.params.userId)
        ? req.params.userId[0]
        : req.params.userId;

      const gardenId = Array.isArray(req.params.gardenId)
        ? req.params.gardenId[0]
        : req.params.gardenId;

      const plant = await this.createPlantService.execute(
        userId,
        gardenId,
        req.body,
      );

      res.status(201).json(plant);
    } catch (error) {
      next(error);
    }
  };

  getByGarden = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Array.isArray(req.params.userId)
        ? req.params.userId[0]
        : req.params.userId;

      const gardenId = Array.isArray(req.params.gardenId)
        ? req.params.gardenId[0]
        : req.params.gardenId;

      const plants = await this.getGardenPlantsService.execute(
        userId,
        gardenId,
      );

      res.status(200).json(plants);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Array.isArray(req.params.userId)
        ? req.params.userId[0]
        : req.params.userId;

      const gardenId = Array.isArray(req.params.gardenId)
        ? req.params.gardenId[0]
        : req.params.gardenId;

      const plantId = Array.isArray(req.params.plantId)
        ? req.params.plantId[0]
        : req.params.plantId;

      const plant = await this.getPlantService.execute(
        userId,
        gardenId,
        plantId,
      );

      res.status(200).json(plant);
    } catch (error) {
      next(error);
    }
  };
}

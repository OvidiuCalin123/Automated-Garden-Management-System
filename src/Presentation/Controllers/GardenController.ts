import type { Request, Response, NextFunction } from "express";
import { CreateGardenService } from "../../Application/Services/CreateGardenService.js";
import { GetUserGardensService } from "../../Application/Services/GetUserGardensService.js";
import { GetGardenService } from "../../Application/Services/GetGardenService.js";
import { UpdateGardenService } from "../../Application/Services/UpdateGardenService.js";
import { DeleteGardenService } from "../../Application/Services/DeleteGardenService.js";

export class GardenController {
  constructor(
    private readonly createGardenService: CreateGardenService,
    private readonly getUserGardensService: GetUserGardensService,
    private readonly getGardenService: GetGardenService,
    private readonly updateGardenService: UpdateGardenService,
    private readonly deleteGardenService: DeleteGardenService,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const garden = await this.createGardenService.execute(
        Array.isArray(req.params.userId)
          ? req.params.userId[0]
          : req.params.userId,
        req.body,
      );

      res.status(201).json(garden);
    } catch (error) {
      next(error);
    }
  };
  getByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Array.isArray(req.params.userId)
        ? req.params.userId[0]
        : req.params.userId;

      const gardens = await this.getUserGardensService.execute(userId);

      res.status(200).json(gardens);
    } catch (error) {
      next(error);
    }
  };
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gardenId = Array.isArray(req.params.gardenId)
        ? req.params.gardenId[0]
        : req.params.gardenId;

      const garden = await this.getGardenService.execute(gardenId);

      res.status(200).json(garden);
    } catch (error) {
      next(error);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gardenId = Array.isArray(req.params.gardenId)
        ? req.params.gardenId[0]
        : req.params.gardenId;

      const garden = await this.updateGardenService.execute(gardenId, req.body);

      res.status(200).json(garden);
    } catch (error) {
      next(error);
    }
  };
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gardenId = Array.isArray(req.params.gardenId)
        ? req.params.gardenId[0]
        : req.params.gardenId;

      await this.deleteGardenService.execute(gardenId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

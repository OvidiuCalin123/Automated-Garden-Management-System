import { Router } from "express";

import { PlantController } from "../Controllers/PlantController.js";

import {
  createPlantService,
  getGardenPlantsService,
  getPlantService,
} from "../../CompositionRoot/plantDependencies.js";

import { validateCreatePlant } from "../Middleware/validateCreatePlant.js";

const router = Router({ mergeParams: true });

const plantController = new PlantController(
  createPlantService,
  getGardenPlantsService,
  getPlantService,
);

router.post("/", validateCreatePlant, plantController.create);

router.get("/", plantController.getByGarden);

router.get("/:plantId", plantController.getById);

export default router;

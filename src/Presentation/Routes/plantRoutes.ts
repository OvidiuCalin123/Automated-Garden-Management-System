import { Router } from "express";

import { PlantController } from "../Controllers/PlantController.js";

import {
  createPlantService,
  getGardenPlantsService,
  getPlantService,
  updatePlantService,
} from "../../CompositionRoot/plantDependencies.js";

import { validateCreatePlant } from "../Middleware/validateCreatePlant.js";
import { validateUpdatePlant } from "../Middleware/validateUpdatePlant.js";

const router = Router({ mergeParams: true });

const plantController = new PlantController(
  createPlantService,
  getGardenPlantsService,
  getPlantService,
  updatePlantService,
);

router.post("/", validateCreatePlant, plantController.create);

router.get("/", plantController.getByGarden);

router.get("/:plantId", plantController.getById);

router.put("/:plantId", validateUpdatePlant, plantController.update);

export default router;

import { Router } from "express";

import { PlantController } from "../Controllers/PlantController.js";

import {
  createPlantService,
  getGardenPlantsService,
  getPlantService,
  updatePlantService,
  deletePlantService,
} from "../../CompositionRoot/plantDependencies.js";

import { validateCreatePlant } from "../Middleware/validateCreatePlant.js";
import { validateUpdatePlant } from "../Middleware/validateUpdatePlant.js";

const router = Router({ mergeParams: true });

const plantController = new PlantController(
  createPlantService,
  getGardenPlantsService,
  getPlantService,
  updatePlantService,
  deletePlantService,
);

router.post("/", validateCreatePlant, plantController.create);
router.get("/", plantController.getByGarden);
router.get("/:plantId", plantController.getById);
router.put("/:plantId", validateUpdatePlant, plantController.update);
router.delete("/:plantId", plantController.delete);

export default router;

import { Router } from "express";
import { PlantController } from "../Controllers/PlantController.js";
import { createPlantService } from "../../CompositionRoot/plantDependencies.js";
import { validateCreatePlant } from "../Middleware/validateCreatePlant.js";

const router = Router({ mergeParams: true });

const plantController = new PlantController(createPlantService);

router.post("/", validateCreatePlant, plantController.create);

export default router;

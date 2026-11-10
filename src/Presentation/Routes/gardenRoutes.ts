import { Router } from "express";
import { GardenController } from "../Controllers/GardenController.js";
import {
  createGardenService,
  deleteGardenService,
  getGardenService,
  getUserGardensService,
  updateGardenService,
} from "../../CompositionRoot/gardenDependencies.js";
import { validateCreateGarden } from "../Middleware/validateCreateGarden.js";
import { validateUpdateGarden } from "../Middleware/validateUpdateGarden.js";

const router = Router({ mergeParams: true });

const gardenController = new GardenController(
  createGardenService,
  getUserGardensService,
  getGardenService,
  updateGardenService,
  deleteGardenService,
);
router.post("/", validateCreateGarden, gardenController.create);
router.get("/", gardenController.getByUser);
router.get("/:gardenId", gardenController.getById);
router.put("/:gardenId", validateUpdateGarden, gardenController.update);
router.delete("/:gardenId", gardenController.delete);

export default router;

import { PrismaPlantRepository } from "../Infrastructure/Repositories/PrismaPlantRepository.js";
import { PrismaGardenRepository } from "../Infrastructure/Repositories/PrismaGardenRepository.js";

import { CreatePlantService } from "../Application/Services/CreatePlantService.js";
import { GetGardenPlantsService } from "../Application/Services/GetGardenPlantsService.js";
import { GetPlantService } from "../Application/Services/GetPlantService.js";

const plantRepository = new PrismaPlantRepository();
const gardenRepository = new PrismaGardenRepository();

export const createPlantService = new CreatePlantService(
  plantRepository,
  gardenRepository,
);

export const getGardenPlantsService = new GetGardenPlantsService(
  plantRepository,
  gardenRepository,
);

export const getPlantService = new GetPlantService(
  plantRepository,
  gardenRepository,
);

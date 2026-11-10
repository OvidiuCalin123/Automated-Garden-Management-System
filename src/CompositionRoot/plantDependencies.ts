import { PrismaPlantRepository } from "../Infrastructure/Repositories/PrismaPlantRepository.js";
import { CreatePlantService } from "../Application/Services/CreatePlantService.js";

const plantRepository = new PrismaPlantRepository();

export const createPlantService = new CreatePlantService(plantRepository);

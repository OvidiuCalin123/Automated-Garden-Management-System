import { PrismaGardenRepository } from "../Infrastructure/Repositories/PrismaGardenRepository.js";
import { PrismaUserRepository } from "../Infrastructure/Repositories/PrismaUserRepository.js";
import { CreateGardenService } from "../Application/Services/CreateGardenService.js";
import { GetUserGardensService } from "../Application/Services/GetUserGardensService.js";
import { GetGardenService } from "../Application/Services/GetGardenService.js";
import { UpdateGardenService } from "../Application/Services/UpdateGardenService.js";
import { DeleteGardenService } from "../Application/Services/DeleteGardenService.js";

const gardenRepository = new PrismaGardenRepository();
const userRepository = new PrismaUserRepository();

export const createGardenService = new CreateGardenService(
  gardenRepository,
  userRepository,
);
export const getUserGardensService = new GetUserGardensService(
  gardenRepository,
  userRepository,
);
export const getGardenService = new GetGardenService(gardenRepository);
export const updateGardenService = new UpdateGardenService(gardenRepository);
export const deleteGardenService = new DeleteGardenService(gardenRepository);

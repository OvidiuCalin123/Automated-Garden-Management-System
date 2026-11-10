import { IPlantRepository } from "../Interfaces/IPlantRepository.js";
import { IGardenRepository } from "../Interfaces/IGardenRepository.js";
import { Plant } from "../../Domain/Entities/Plant.js";
import { AppError } from "../Errors/AppError.js";

export class GetPlantService {
  constructor(
    private readonly plantRepository: IPlantRepository,
    private readonly gardenRepository: IGardenRepository,
  ) {}

  async execute(
    userId: string,
    gardenId: string,
    plantId: string,
  ): Promise<Plant> {
    const garden = await this.gardenRepository.findById(gardenId);

    if (!garden || garden.userId !== userId) {
      throw new AppError("Garden not found.", 404);
    }

    const plant = await this.plantRepository.findById(plantId, gardenId);

    if (!plant) {
      throw new AppError("Plant not found.", 404);
    }

    return plant;
  }
}

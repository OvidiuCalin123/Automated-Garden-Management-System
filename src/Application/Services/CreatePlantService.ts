import { IPlantRepository } from "../Interfaces/IPlantRepository.js";
import { Plant } from "../../Domain/Entities/Plant.js";
import { AppError } from "../Errors/AppError.js";

type CreatePlantData = Omit<Plant, "plantId">;

export class CreatePlantService {
  constructor(private readonly plantRepository: IPlantRepository) {}

  async execute(plantData: CreatePlantData): Promise<Plant> {
    const result = await this.plantRepository.createWithinCapacity(plantData);

    if (result.status === "garden_not_found") {
      throw new AppError("Garden not found.", 404);
    }

    if (result.status === "capacity_exceeded") {
      throw new AppError(
        `Not enough garden space. Available area: ${result.availableArea} m².`,
        409,
      );
    }

    return result.plant;
  }
}

import {
  IPlantRepository,
  UpdatePlantData,
} from "../Interfaces/IPlantRepository.js";

import { IGardenRepository } from "../Interfaces/IGardenRepository.js";
import { Plant } from "../../Domain/Entities/Plant.js";
import { AppError } from "../Errors/AppError.js";

export class UpdatePlantService {
  constructor(
    private readonly plantRepository: IPlantRepository,
    private readonly gardenRepository: IGardenRepository,
  ) {}

  async execute(
    userId: string,
    gardenId: string,
    plantId: string,
    data: UpdatePlantData,
  ): Promise<Plant> {
    const garden = await this.gardenRepository.findById(gardenId);

    if (!garden || garden.userId !== userId) {
      throw new AppError("Garden not found.", 404);
    }

    const result = await this.plantRepository.updateWithinCapacity(
      plantId,
      gardenId,
      data,
    );

    if (result.status === "garden_not_found") {
      throw new AppError("Garden not found.", 404);
    }

    if (result.status === "plant_not_found") {
      throw new AppError("Plant not found.", 404);
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

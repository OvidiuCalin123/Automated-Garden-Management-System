import {
  IGardenRepository,
  UpdateGardenResult,
} from "../Interfaces/IGardenRepository.js";

import { Garden } from "../../Domain/Entities/Garden.js";
import { AppError } from "../Errors/AppError.js";

export type UpdateGardenData = Partial<Omit<Garden, "gardenId" | "userId">>;

export class UpdateGardenService {
  constructor(private readonly gardenRepository: IGardenRepository) {}

  async execute(
    userId: string,
    gardenId: string,
    gardenData: UpdateGardenData,
  ): Promise<Garden> {
    const garden = await this.gardenRepository.findById(gardenId);

    if (!garden || garden.userId !== userId) {
      throw new AppError("Garden not found.", 404);
    }

    const result: UpdateGardenResult =
      await this.gardenRepository.updateWithinCapacity(gardenId, gardenData);

    if (result.status === "garden_not_found") {
      throw new AppError("Garden not found.", 404);
    }

    if (result.status === "capacity_exceeded") {
      throw new AppError(
        `Garden cannot have less than ${result.usedArea.toFixed(2)} m² because that area is already occupied by plants.`,
        409,
      );
    }

    return result.garden;
  }
}

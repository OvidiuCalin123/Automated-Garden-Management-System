import { IPlantRepository } from "../Interfaces/IPlantRepository.js";
import { IGardenRepository } from "../Interfaces/IGardenRepository.js";
import { AppError } from "../Errors/AppError.js";

export class DeletePlantService {
  constructor(
    private readonly plantRepository: IPlantRepository,
    private readonly gardenRepository: IGardenRepository,
  ) {}

  async execute(
    userId: string,
    gardenId: string,
    plantId: string,
  ): Promise<void> {
    const garden = await this.gardenRepository.findById(gardenId);

    if (!garden || garden.userId !== userId) {
      throw new AppError("Garden not found.", 404);
    }

    const deleted = await this.plantRepository.delete(plantId, gardenId);

    if (!deleted) {
      throw new AppError("Plant not found.", 404);
    }
  }
}

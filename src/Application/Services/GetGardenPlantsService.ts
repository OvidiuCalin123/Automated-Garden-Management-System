import { IPlantRepository } from "../Interfaces/IPlantRepository.js";
import { IGardenRepository } from "../Interfaces/IGardenRepository.js";
import { Plant } from "../../Domain/Entities/Plant.js";
import { AppError } from "../Errors/AppError.js";

export class GetGardenPlantsService {
  constructor(
    private readonly plantRepository: IPlantRepository,
    private readonly gardenRepository: IGardenRepository,
  ) {}

  async execute(userId: string, gardenId: string): Promise<Plant[]> {
    const garden = await this.gardenRepository.findById(gardenId);

    if (!garden || garden.userId !== userId) {
      throw new AppError("Garden not found.", 404);
    }

    return this.plantRepository.findByGardenId(gardenId);
  }
}

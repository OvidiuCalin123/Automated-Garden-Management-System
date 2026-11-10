import { IGardenRepository } from "../Interfaces/IGardenRepository.js";
import { Garden } from "../../Domain/Entities/Garden.js";
import { AppError } from "../Errors/AppError.js";

export class GetGardenService {
  constructor(private readonly gardenRepository: IGardenRepository) {}

  async execute(userId: string, gardenId: string): Promise<Garden> {
    const garden = await this.gardenRepository.findById(gardenId);

    if (!garden || garden.userId !== userId) {
      throw new AppError("Garden not found.", 404);
    }

    return garden;
  }
}

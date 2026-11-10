import { IGardenRepository } from "../Interfaces/IGardenRepository.js";
import { AppError } from "../Errors/AppError.js";

export class DeleteGardenService {
  constructor(private readonly gardenRepository: IGardenRepository) {}

  async execute(gardenId: string): Promise<void> {
    const garden = await this.gardenRepository.findById(gardenId);

    if (!garden) {
      throw new AppError("Garden not found.", 404);
    }

    await this.gardenRepository.delete(gardenId);
  }
}

import { IGardenRepository } from "../Interfaces/IGardenRepository.js";
import { Garden } from "../../Domain/Entities/Garden.js";
import { AppError } from "../Errors/AppError.js";

type UpdateGardenData = Partial<Omit<Garden, "gardenId" | "userId">>;

export class UpdateGardenService {
  constructor(private readonly gardenRepository: IGardenRepository) {}

  async execute(
    gardenId: string,
    gardenData: UpdateGardenData,
  ): Promise<Garden> {
    const existingGarden = await this.gardenRepository.findById(gardenId);

    if (!existingGarden) {
      throw new AppError("Garden not found.", 404);
    }

    return this.gardenRepository.update(gardenId, gardenData);
  }
}

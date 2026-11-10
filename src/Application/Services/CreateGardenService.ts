import { IGardenRepository } from "../Interfaces/IGardenRepository.js";
import { IUserRepository } from "../Interfaces/IUserRepository.js";
import { Garden } from "../../Domain/Entities/Garden.js";
import { AppError } from "../Errors/AppError.js";

type CreateGardenData = Omit<Garden, "gardenId" | "userId">;

export class CreateGardenService {
  constructor(
    private readonly gardenRepository: IGardenRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, gardenData: CreateGardenData): Promise<Garden> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    return this.gardenRepository.create({
      ...gardenData,
      userId,
    });
  }
}

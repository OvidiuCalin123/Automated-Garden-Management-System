import { Garden } from "../../Domain/Entities/Garden.js";

export interface IGardenRepository {
  create(garden: Omit<Garden, "gardenId">): Promise<Garden>;
  findById(gardenId: string): Promise<Garden | null>;
  findByUserId(userId: string): Promise<Garden[]>;
  update(
    gardenId: string,
    data: Partial<Omit<Garden, "gardenId" | "userId">>,
  ): Promise<Garden>;
  delete(gardenId: string): Promise<void>;
}

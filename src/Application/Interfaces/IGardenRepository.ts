import { Garden } from "../../Domain/Entities/Garden.js";

export type UpdateGardenResult =
  | { status: "updated"; garden: Garden }
  | { status: "garden_not_found" }
  | { status: "capacity_exceeded"; usedArea: number };

export interface IGardenRepository {
  create(garden: Omit<Garden, "gardenId">): Promise<Garden>;
  findById(gardenId: string): Promise<Garden | null>;
  findByUserId(userId: string): Promise<Garden[]>;
  updateWithinCapacity(
    gardenId: string,
    data: Partial<
      Pick<
        Garden,
        | "gardenName"
        | "totalSurfaceArea"
        | "locationDescription"
        | "latitude"
        | "longitude"
      >
    >,
  ): Promise<UpdateGardenResult>;
  delete(gardenId: string): Promise<void>;
}

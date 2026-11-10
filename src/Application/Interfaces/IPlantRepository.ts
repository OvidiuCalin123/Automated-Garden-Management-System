import { Plant } from "../../Domain/Entities/Plant.js";

export type CreatePlantResult =
  | { status: "created"; plant: Plant }
  | { status: "garden_not_found" }
  | { status: "capacity_exceeded"; availableArea: number };

export type UpdatePlantData = Partial<
  Pick<
    Plant,
    | "plantName"
    | "species"
    | "plantType"
    | "plantationDate"
    | "surfaceAreaRequired"
    | "idealHumidityLevel"
  >
>;

export type UpdatePlantResult =
  | { status: "updated"; plant: Plant }
  | { status: "garden_not_found" }
  | { status: "plant_not_found" }
  | { status: "capacity_exceeded"; availableArea: number };

export interface IPlantRepository {
  createWithinCapacity(
    plant: Omit<Plant, "plantId" | "metric">,
  ): Promise<CreatePlantResult>;

  findByGardenId(gardenId: string): Promise<Plant[]>;

  findById(plantId: string, gardenId: string): Promise<Plant | null>;

  updateWithinCapacity(
    plantId: string,
    gardenId: string,
    data: UpdatePlantData,
  ): Promise<UpdatePlantResult>;
}

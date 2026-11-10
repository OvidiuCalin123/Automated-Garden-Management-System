import {
  IPlantRepository,
  CreatePlantResult,
} from "../../Application/Interfaces/IPlantRepository.js";
import { Plant } from "../../Domain/Entities/Plant.js";
import { prisma } from "../Database/prisma.js";

export class PrismaPlantRepository implements IPlantRepository {
  private mapPlant(
    plant: Awaited<ReturnType<typeof prisma.plant.create>>,
  ): Plant {
    return {
      ...plant,
      surfaceAreaRequired: Number(plant.surfaceAreaRequired),
    };
  }

  async createWithinCapacity(
    plant: Omit<Plant, "plantId">,
  ): Promise<CreatePlantResult> {
    return prisma.$transaction(async (transaction) => {
      const lockedGarden = await transaction.$queryRaw<{ gardenId: string }[]>`
                SELECT "gardenId"
                FROM "Garden"
                WHERE "gardenId" = ${plant.gardenId}::uuid
                FOR UPDATE
            `;

      if (lockedGarden.length === 0) {
        return { status: "garden_not_found" };
      }

      const garden = await transaction.garden.findUnique({
        where: { gardenId: plant.gardenId },
        select: { totalSurfaceArea: true },
      });

      if (!garden) {
        return { status: "garden_not_found" };
      }

      const existingPlants = await transaction.plant.aggregate({
        where: { gardenId: plant.gardenId },
        _sum: {
          surfaceAreaRequired: true,
        },
      });

      const usedArea = Number(existingPlants._sum.surfaceAreaRequired ?? 0);

      const totalArea = Number(garden.totalSurfaceArea);
      const availableArea = totalArea - usedArea;

      if (plant.surfaceAreaRequired > availableArea) {
        return {
          status: "capacity_exceeded",
          availableArea,
        };
      }

      const createdPlant = await transaction.plant.create({
        data: {
          ...plant,
          metric: {
            create: {
              currentHumidityLevel: 50,
            },
          },
        },
      });

      return {
        status: "created",
        plant: this.mapPlant(createdPlant),
      };
    });
  }
}

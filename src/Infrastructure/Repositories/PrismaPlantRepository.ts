import {
  IPlantRepository,
  CreatePlantResult,
} from "../../Application/Interfaces/IPlantRepository.js";

import { Plant } from "../../Domain/Entities/Plant.js";
import { prisma } from "../Database/prisma.js";
import type { Prisma } from "../../../generated/prisma/client.js";

type PlantWithMetric = Prisma.PlantGetPayload<{
  include: { metric: true };
}>;

export class PrismaPlantRepository implements IPlantRepository {
  private mapPlant(plant: PlantWithMetric): Plant {
    return {
      ...plant,
      surfaceAreaRequired: Number(plant.surfaceAreaRequired),
      metric: plant.metric
        ? {
            ...plant.metric,
            currentHumidityLevel: Number(plant.metric.currentHumidityLevel),
          }
        : null,
    };
  }

  async createWithinCapacity(
    plant: Omit<Plant, "plantId" | "metric">,
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

      const availableArea = Number(garden.totalSurfaceArea) - usedArea;

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
        include: {
          metric: true,
        },
      });

      return {
        status: "created",
        plant: this.mapPlant(createdPlant),
      };
    });
  }

  async findByGardenId(gardenId: string): Promise<Plant[]> {
    const plants = await prisma.plant.findMany({
      where: { gardenId },
      include: {
        metric: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return plants.map((plant) => this.mapPlant(plant));
  }

  async findById(plantId: string, gardenId: string): Promise<Plant | null> {
    const plant = await prisma.plant.findFirst({
      where: {
        plantId,
        gardenId,
      },
      include: {
        metric: true,
      },
    });

    return plant ? this.mapPlant(plant) : null;
  }
}

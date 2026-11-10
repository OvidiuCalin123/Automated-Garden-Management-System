import {
  IPlantRepository,
  CreatePlantResult,
  UpdatePlantData,
  UpdatePlantResult,
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

  async updateWithinCapacity(
    plantId: string,
    gardenId: string,
    data: UpdatePlantData,
  ): Promise<UpdatePlantResult> {
    return prisma.$transaction(async (transaction) => {
      const lockedGarden = await transaction.$queryRaw<{ gardenId: string }[]>`
            SELECT "gardenId"
            FROM "Garden"
            WHERE "gardenId" = ${gardenId}::uuid
            FOR UPDATE
        `;

      if (lockedGarden.length === 0) {
        return { status: "garden_not_found" };
      }

      const existingPlant = await transaction.plant.findFirst({
        where: {
          plantId,
          gardenId,
        },
      });

      if (!existingPlant) {
        return { status: "plant_not_found" };
      }

      const garden = await transaction.garden.findUnique({
        where: { gardenId },
        select: { totalSurfaceArea: true },
      });

      if (!garden) {
        return { status: "garden_not_found" };
      }

      const otherPlants = await transaction.plant.aggregate({
        where: {
          gardenId,
          plantId: {
            not: plantId,
          },
        },
        _sum: {
          surfaceAreaRequired: true,
        },
      });

      const usedArea = Number(otherPlants._sum.surfaceAreaRequired ?? 0);

      const availableArea = Number(garden.totalSurfaceArea) - usedArea;

      const requestedArea =
        data.surfaceAreaRequired ?? Number(existingPlant.surfaceAreaRequired);

      if (requestedArea > availableArea) {
        return {
          status: "capacity_exceeded",
          availableArea,
        };
      }

      const updatedPlant = await transaction.plant.update({
        where: { plantId },
        data,
        include: {
          metric: true,
        },
      });

      return {
        status: "updated",
        plant: this.mapPlant(updatedPlant),
      };
    });
  }
  async delete(plantId: string, gardenId: string): Promise<boolean> {
    const result = await prisma.plant.deleteMany({
      where: {
        plantId,
        gardenId,
      },
    });

    return result.count > 0;
  }
}

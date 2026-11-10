import {
  IGardenRepository,
  UpdateGardenResult,
} from "../../Application/Interfaces/IGardenRepository.js";
import { Garden } from "../../Domain/Entities/Garden.js";
import { prisma } from "../Database/prisma.js";

export class PrismaGardenRepository implements IGardenRepository {
  private mapGarden(garden: any): Garden {
    return {
      ...garden,
      totalSurfaceArea: Number(garden.totalSurfaceArea),
    };
  }

  async create(garden: Omit<Garden, "gardenId">): Promise<Garden> {
    const createdGarden = await prisma.garden.create({
      data: garden,
    });

    return this.mapGarden(createdGarden);
  }

  async findById(gardenId: string): Promise<Garden | null> {
    const garden = await prisma.garden.findUnique({
      where: { gardenId },
    });

    return garden ? this.mapGarden(garden) : null;
  }

  async findByUserId(userId: string): Promise<Garden[]> {
    const gardens = await prisma.garden.findMany({
      where: { userId },
    });

    return gardens.map((garden) => this.mapGarden(garden));
  }

  async updateWithinCapacity(
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
  ): Promise<UpdateGardenResult> {
    return prisma.$transaction(async (tx) => {
      const lockedGardens = await tx.$queryRaw<Array<{ gardenId: string }>>`
            SELECT "gardenId"
            FROM "Garden"
            WHERE "gardenId" = ${gardenId}::uuid
            FOR UPDATE
        `;

      if (lockedGardens.length === 0) {
        return { status: "garden_not_found" };
      }

      const garden = await tx.garden.findUnique({
        where: { gardenId },
      });

      if (!garden) {
        return { status: "garden_not_found" };
      }

      const plantArea = await tx.plant.aggregate({
        where: { gardenId },
        _sum: {
          surfaceAreaRequired: true,
        },
      });

      const usedArea = Number(plantArea._sum.surfaceAreaRequired ?? 0);

      const newTotalArea =
        data.totalSurfaceArea ?? Number(garden.totalSurfaceArea);

      if (newTotalArea < usedArea) {
        return {
          status: "capacity_exceeded",
          usedArea,
        };
      }

      const updatedGarden = await tx.garden.update({
        where: { gardenId },
        data,
      });

      return {
        status: "updated",
        garden: this.mapGarden(updatedGarden),
      };
    });
  }

  async delete(gardenId: string): Promise<void> {
    await prisma.garden.delete({
      where: { gardenId },
    });
  }
}

import { IGardenRepository } from "../../Application/Interfaces/IGardenRepository.js";
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

  async update(
    gardenId: string,
    data: Partial<Omit<Garden, "gardenId" | "userId">>,
  ): Promise<Garden> {
    const updatedGarden = await prisma.garden.update({
      where: { gardenId },
      data,
    });

    return this.mapGarden(updatedGarden);
  }

  async delete(gardenId: string): Promise<void> {
    await prisma.garden.delete({
      where: { gardenId },
    });
  }
}

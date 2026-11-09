import { IUserRepository } from "../../Application/Interfaces/IUserRepository.js";
import { User } from "../../Domain/Entities/User.js";
import { prisma } from "../Database/prisma.js";

export class PrismaUserRepository implements IUserRepository {
  async create(user: Omit<User, "userId">): Promise<User> {
    return prisma.user.create({
      data: user,
    });
  }

  async findByEmail(emailAddress: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { emailAddress },
    });
  }

  async findById(userId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { userId },
    });
  }
}

import { PrismaUserRepository } from "../Infrastructure/Repositories/PrismaUserRepository.js";
import { CreateUserService } from "../Application/Services/CreateUserService.js";

const userRepository = new PrismaUserRepository();

export const createUserService = new CreateUserService(userRepository);

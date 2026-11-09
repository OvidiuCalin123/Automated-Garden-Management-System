import { IUserRepository } from "../Interfaces/IUserRepository.js";
import { User } from "../../Domain/Entities/User.js";
import { AppError } from "../Errors/AppError.js";

export class CreateUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userData: Omit<User, "userId">): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(
      userData.emailAddress,
    );

    if (existingUser) {
      throw new AppError("A user with this email address already exists.", 409);
    }

    return this.userRepository.create(userData);
  }
}

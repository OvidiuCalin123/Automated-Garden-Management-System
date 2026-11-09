import { User } from "../../Domain/Entities/User.js";

export interface IUserRepository {
  create(user: Omit<User, "userId">): Promise<User>;
  findByEmail(emailAddress: string): Promise<User | null>;
  findById(userId: string): Promise<User | null>;
}

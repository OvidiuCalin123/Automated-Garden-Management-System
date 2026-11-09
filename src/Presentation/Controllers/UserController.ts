import { Request, Response, NextFunction } from "express";
import { CreateUserService } from "../../Application/Services/CreateUserService.js";

export class UserController {
  constructor(private readonly createUserService: CreateUserService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.createUserService.execute(req.body);

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };
}

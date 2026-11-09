import { Router } from "express";
import { UserController } from "../Controllers/UserController.js";
import { createUserService } from "../../CompositionRoot/userDependencies.js";
import { validateCreateUser } from "../Middleware/validateCreateUser.js";

const router = Router();

const userController = new UserController(createUserService);

router.post("/", validateCreateUser, userController.create);

export default router;

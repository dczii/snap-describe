import { Router } from "express";
import { authController } from "../controllers/authController";


export const authRouter = Router();

authRouter.post("/mobile/login", authController.login)
authRouter.post("/mobile/register", authController.register)
import { Router } from "express";
import { helloRouter } from "./hello";
import { loginRouter } from "./auth";

//routes stack
export const router = Router();

router.use("/hello", helloRouter)
router.use("/auth", loginRouter)

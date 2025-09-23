import { Router } from "express";
import { helloRouter } from "./hello";

export const router = Router();

router.use("/hello", helloRouter)
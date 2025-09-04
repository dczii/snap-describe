import { Router } from "express";
import { helloRouter } from "./hello";

//routes stack
export const router = Router();

router.use("/hello", helloRouter)

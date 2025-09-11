import { Router, Request, Response } from "express";
export const helloRouter = Router();

helloRouter.get("/", (req: Request, res: Response) => {
    res.status(200).send("Hello Word")
})
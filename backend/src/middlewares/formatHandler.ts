import { Request, Response, NextFunction } from "express";
import logger from "../logger";

export function jsonSyntaxErrorAndEmptyBodyHandler(
  err: SyntaxError, 
  req: Request,
  res: Response,
  next: NextFunction
) {

  if (err instanceof SyntaxError || !req.body || Object.keys(req.body).length === 0) {
    logger.warn("Client error detected:", err.message);

    // 404 to confuse attacker
    return res.sendStatus(404);
  }

  next(err);
}

import { Request, Response, NextFunction } from "express";


export function jsonSyntaxError(
  err: SyntaxError, 
  req: Request,
  res: Response,
  next: NextFunction
) {

  if ('body' in err) {
    return res.sendStatus(404)
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.sendStatus(404)
  }

  next(err);
}

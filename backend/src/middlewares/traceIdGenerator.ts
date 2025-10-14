import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export interface TraceRequest extends Request {
  traceId: string;
}

export function traceRequest(req: Request, res: Response, next: NextFunction) {
  const typedReq = req as TraceRequest;
  typedReq.traceId = uuidv4();
  next();
}

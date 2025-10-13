import { authContext } from '../services/authServices';
import { Request, Response, NextFunction } from 'express';
import logger from '../logger';
import { Pool } from 'pg';

export interface AuthRequest extends Request {
  userId?: string | null;
  deviceHash?: string | null;
  db: Pool;
}

//simple middleware for now
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  try {
    const { db, userId, deviceHash } = authContext(authHeader);
    const typedReq = req as AuthRequest;
    typedReq.userId = userId;
    typedReq.deviceHash = deviceHash;
    typedReq.db = db;
    next();
  } catch (err) {
    logger.error(err);
    res.status(401).json({ message: 'Invalid token' });
  }
};



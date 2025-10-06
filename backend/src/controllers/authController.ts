import { Request, Response } from 'express';
import { hashClientDevice, getClientIp } from '../utils/authUtils';
import logger from '../logger';
import { login, register } from '../services/authServices';
import { TraceRequest } from '../middlewares/traceIdGenerator';
import { ERROR_RESPONSES, ErrorType } from '../../configs/apiResponses';


export const authController = {
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const ip = getClientIp(req);
    const deviceHash = hashClientDevice(req);

    try {
      const { accessToken, refreshToken } = await login(
        email.toLowerCase(),
        password,
        ip,
        deviceHash,
      );

      return res.status(200).json({
        message: 'Login successful',
        accessToken,
        refreshToken,
      });
    } catch (err) {
      if (err instanceof Error && err.message in ERROR_RESPONSES) {
        const { status, code, message } =
          ERROR_RESPONSES[err.message as ErrorType];
        return res.status(status).json({ code, message });
      }

      const traceId = (req as TraceRequest).traceId;

      logger.error('Login error', {
        code: 'INTERNAL_ERROR',
        message: err instanceof Error ? err.message : 'Unknown error',
        traceId,
        endpoint: req.originalUrl,
        stack: err instanceof Error ? err.stack : undefined,
      });

      return res.status(500).json({
        code: 'INTERNAL_ERROR',
        message: 'Internal Server Error',
        traceId,
      });
    }
  },

  register: async (req: Request, res: Response) => {
    const { fullname, phoneNumber, email, password } = req.body;
    const ip = getClientIp(req);
    const deviceHash = hashClientDevice(req);

    try {
      const { accessToken, refreshToken } = await register(
        fullname,
        phoneNumber,
        email.toLowerCase(),
        password,
        ip,
        deviceHash,
      );

      return res.status(201).json({
        message: 'Registration successful',
        accessToken,
        refreshToken,
      });
    } catch (err) {
      if (err instanceof Error && err.message in ERROR_RESPONSES) {
        const { status, code, message } =
          ERROR_RESPONSES[err.message as ErrorType];
        return res.status(status).json({ code, message });
      }

      const traceId = (req as TraceRequest).traceId;

      logger.error('Registration error', {
        code: 'INTERNAL_ERROR',
        message: err instanceof Error ? err.message : 'Unknown error',
        traceId,
        endpoint: req.originalUrl,
        stack: err instanceof Error ? err.stack : undefined,
      });

      return res.status(500).json({
        code: 'INTERNAL_ERROR',
        message: 'Internal Server Error',
        traceId,
      });
    }
  },
};

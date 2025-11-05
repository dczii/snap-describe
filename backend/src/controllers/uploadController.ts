import { Request, Response } from 'express';
import logger from '../logger';
import { AuthRequest } from '../middlewares/authMiddleware';
import { signedUrl } from '../services/authServices';
import { getClientIp, hashClientDevice } from '../utils/authUtils';
import { ERROR_RESPONSES, ErrorType } from '../../configs/apiResponses';
import { TraceRequest } from '../middlewares/traceIdGenerator';

export interface ImageDTO {
  fileName: string;
  mimeType: string;
}

//simple upload endpoint for now
export const uploadController = {
  uploadUrl: async (req: Request, res: Response) => {
    const ip = getClientIp(req);
    const deviceHash = hashClientDevice(req);
    const userId = (req as AuthRequest).userId;
    const images: ImageDTO[] = req.body.images;
    try {
      const uploadUrls = await signedUrl(ip, deviceHash, userId, images);
      return res.status(200).json(uploadUrls);
    } catch (err) {
      if (err instanceof Error && err.message in ERROR_RESPONSES) {
        const { status, code, message } =
          ERROR_RESPONSES[err.message as ErrorType];
        return res.status(status).json({ code, message });
      }

      const traceId = (req as TraceRequest).traceId;

      logger.error('Signed url error', {
        code: 'UNEXPECTED_ERROR',
        message: err instanceof Error ? err.message : 'Unknown error',
        traceId,
        endpoint: req.originalUrl,
        stack: err instanceof Error ? err.stack : undefined,
      });

      return res.status(500).json({
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        traceId,
      });
    }
  },
};

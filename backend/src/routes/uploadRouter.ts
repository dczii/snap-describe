import { Router } from 'express';
import { uploadController } from '../controllers/uploadController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const uploadRouter = Router();

uploadRouter.post(
  '/v1/mobile/upload-url',
  authMiddleware,
  uploadController.uploadUrl,
);

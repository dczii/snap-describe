import { Request, Response } from 'express';
import logger from '../logger';
import supabase from '../../configs/supabaseConfig';
import { AuthRequest } from '../middlewares/authMiddleware';

interface UploadBody {
  images: {
    fileName: string;
    fileType: string;
  }[];
}

//simple upload endpoint for now
export const uploadController = {
  uploadUrl: async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).userId;

    try {
      const { images }: UploadBody = req.body;
      if (images.length === 0 || !userId) return res.sendStatus(400);

      const allowed = ['image/jpeg', 'image/png'];
      const isValidImage = images.some((img) => allowed.includes(img.fileType));

      if (!isValidImage)
        return res.status(400).json({ message: 'invalid filetype' });

      const filePaths = images.map(
        (img) => `temp/${userId}/${Date.now()}_${img.fileName}`,
      );

      const uploadUrls = await Promise.all(
        filePaths.map(async (filePath) => {
          const { data, error } = await supabase.storage
            .from('images')
            .createSignedUploadUrl(filePath, { upsert: false });

          if (error || !data) {
            throw new Error(error.message || 'Supabase failure');
          }

          return { signedUrl: data.signedUrl, filePath: data.path };
        }),
      );

      return res.json({ uploadUrls });
    } catch (err) {
      logger.error(err);
      return res.sendStatus(500);
    }
  },
};

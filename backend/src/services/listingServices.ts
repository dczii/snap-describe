import { GraphQLError } from 'graphql';
import supabase from '../../configs/supabaseConfig';
import {
  ImageMetadata,
  insertMultiImageData,
} from '../database/public.images/imageQueries';
import { env } from '../../configs/env';
import logger from '../logger';
import {
  createListing,
  insertListingPhotos,
  ListingPhotos,
} from '../database/public.listings/listingQueries';
import db from '../../configs/dbConfig';
import { getSellerById } from '../database/public.users/userQueries';
import { Listing_Condition } from '../generated/graphql';

export const uploadProductListing = async (data: {
  userId: string | null | undefined;
  title: string;
  description: string;
  price: number;
  qty: number;
  condition: Listing_Condition;
  categoryId: number;
  notes: string;
  imageFilePaths: string[];
}) => {
  const {
    userId,
    title,
    description,
    price,
    qty,
    condition,
    categoryId,
    notes,
    imageFilePaths,
  } = data;

  try {
    if (!userId) {
      throw new GraphQLError('Unauthorized', {
        extensions: {
          code: 'UNAUTHORIZED',
        },
      });
    }

    const sellerExist = getSellerById(userId);
    if (!sellerExist) {
      throw new GraphQLError('Forbidden', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });
    }

    const invalidFilePath = imageFilePaths.some(
      (filepath) => !filepath.startsWith(`temp/${userId}/`),
    );
    if (invalidFilePath) {
      throw new GraphQLError('Invalid file paths', {
        extensions: {
          code: 'NOT_FOUND',
        },
      });
    }

    const metadata: ImageMetadata[] = await Promise.all(
      imageFilePaths.map(async (filepath) => {
        const fileName = filepath.split('/').at(-1);

        if (!fileName) {
          throw new GraphQLError('Invalid file name');
        }

        const { data: fileData, error: fileError } = await supabase.storage
          .from(env.supabaseBucket)
          .info(filepath);

        if (fileError || !fileData) {
          logger.error(fileError);
          throw new GraphQLError('File not found', {
            extensions: {
              code: 'NOT_FOUND',
            },
          });
        }

        const newPath = `uploads/listingPhotos/${userId}/${Date.now()}_${fileName}`;
        const { data: moveData, error: moveError } = await supabase.storage
          .from(env.supabaseBucket)
          .move(filepath, newPath);

        if (moveError || !moveData) {
          logger.error(moveError);
          throw new GraphQLError('Failed to upload images', {
            extensions: {
              code: 'INTERNAL_ERROR',
            },
          });
        }

        const { data: publicUrlData } = supabase.storage
          .from(env.supabaseBucket)
          .getPublicUrl(newPath);

        return {
          userId,
          fileUrl: publicUrlData.publicUrl,
          filePath: newPath,
          fileName,
          fileSize: fileData.metadata?.size || 0,
          mimeType: fileData.metadata?.mimetype || '',
        };
      }),
    );

    await db.query('BEGIN');
    const listingId = await createListing(
      userId,
      title,
      description,
      price,
      qty,
      condition,
      categoryId,
      notes,
    );

    const imageIds = await insertMultiImageData(metadata);
    const listingPhotos: ListingPhotos[] = imageIds.map((imageId, i) => ({
      listingId,
      imageId,
      sortOrder: i,
    }));

    const result = await insertListingPhotos(listingPhotos);

    if (!result) {
      throw new GraphQLError('Failed to save listing photos', {
        extensions: {
          code: 'DATABASE_ERROR',
        },
      });
    }

    await db.query('COMMIT');
    return {
      message: 'Listing crated successfully',
      data: {
        id: listingId,
      },
    };
  } catch (err) {
    await db.query('ROLLBACK');
    throw err;
  }
};

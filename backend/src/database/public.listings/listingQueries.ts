import db from '../../../configs/dbConfig';
import logger from '../../logger';
import LISTING_PREPARED_QUERIES from './listingPreparedQueries';
import { makePlaceholder } from '../../utils/dbUtils';

export interface ListingPhotos {
    listingId: number
    imageId: string
    sortOrder: number
}

export async function createListing(
  sellerId: string,
  title: string,
  description: string,
  price: number,
  quantity: number,
  condition: 'New' | 'Like New' | 'Used' | 'Fair',
  categoryId: number,
  notes: string,
) {
  try {
    const result = await db.query(
      LISTING_PREPARED_QUERIES.createListing,
      [
        sellerId,
        title,
        description,
        price,
        quantity,
        condition,
        categoryId,
        notes,
      ],
    );
    
    return result.rows[0].id ?? null

  } catch (err) {
    logger.error(err);
    throw new Error('Database Error');
  }
}

export async function insertListingPhotos(listingPhotos: ListingPhotos[]) {
    try {
        const rowCount = listingPhotos.length
        const columnCount = Object.keys(listingPhotos[0]).length
        logger.info(columnCount)
        const placeholder = []
        const values = []

        for (let i = 0; i < rowCount; i++) {
            placeholder.push(makePlaceholder(i, columnCount));
            values.push(...Object.values(listingPhotos[i]))
        }

        const text = `${LISTING_PREPARED_QUERIES.insertListingPhotos.text} ${placeholder.join(",")}`;
        const name = LISTING_PREPARED_QUERIES.insertListingPhotos.name;
        logger.info(text)
        const result = await db.query({name, text}, values)
        return result.rowCount
    } catch (err) {
        logger.error(err)
        throw new Error("Database error")
    }
}

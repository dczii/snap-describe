import db from '../../../configs/dbConfig';
import logger from '../../logger';
import LISTING_PREPARED_STATEMENTS from './listingPreparedQueries';
import { makePlaceholder } from '../../utils/dbUtils';
import { ListingCondition } from '../../generated/graphql';


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
  condition: ListingCondition,
  categoryId: number,
  notes: string,
) {
  try {
    const result = await db.query(LISTING_PREPARED_STATEMENTS.createListing, [
      sellerId,
      title,
      description,
      price,
      quantity,
      condition,
      categoryId,
      notes,
    ]);

    return result.rows[0].id ?? null;
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

        const text = `${
          LISTING_PREPARED_STATEMENTS.insertListingPhotos.text
        } ${placeholder.join(',')}`;
        const name = LISTING_PREPARED_STATEMENTS.insertListingPhotos.name;
        logger.info(text)
        const result = await db.query({name, text}, values)
        return result.rowCount
    } catch (err) {
        logger.error(err)
        throw new Error("Database error")
    }
}

export async function fetchHomepageListings() {
  try {
    const {rows} = await db.query(LISTING_PREPARED_STATEMENTS.getHomepageListings);
    if (!rows) {
      return null
    }
    return rows 
  } catch (err) {
    //simple error handler for now
    logger.error(err)
    throw new Error ("Database error")
  }
}


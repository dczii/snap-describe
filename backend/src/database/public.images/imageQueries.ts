import db from '../../../configs/dbConfig';
import logger from '../../logger';
import { makePlaceholder } from '../../utils/dbUtils';
import IMAGE_PREPARED_QUERIES from './imagePreparedQueries';

export interface ImageMetadata {
  userId: string;
  fileUrl: string;
  filePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

//simple insert images for now
export async function insertImageMetadata(metadata: ImageMetadata) {
  try {
    await db.query(IMAGE_PREPARED_QUERIES.insertImageData, [
      Object.values(metadata),
    ]);
  } catch (err) {
    //simple error handler for now
    logger.error(err);
    throw new Error('Database Error');
  }
}

export async function insertMultiImageData(metadata: ImageMetadata[]) {
    const rowCount = metadata.length;
    const columnCount = Object.keys(metadata[0]).length;
    logger.info(columnCount)
    const placeholder = [];
    const values = [];


    for (let i = 0; i < rowCount; i++) {
        placeholder.push(makePlaceholder(i, columnCount));
        values.push(...Object.values(metadata[i]))
    }

    const name = IMAGE_PREPARED_QUERIES.insertMultiImageData.name;

    const text = `
        ${IMAGE_PREPARED_QUERIES.insertMultiImageData.text} ${placeholder.join(",")} RETURNING id;
    `;

    logger.info(text)
    try {       
        const result = await db.query({name, text}, values);
        return result.rows.map((row) => row.id);  
    } catch (err) {
        logger.error(err);
        throw new Error('Database Error');
    }
}

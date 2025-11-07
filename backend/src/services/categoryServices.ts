import { fetchCategoryNames } from '../database/public.categories/categoryQueries';
import logger from '../logger';

export const getCategoryNames = async () => {
  try {
    return await fetchCategoryNames();
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

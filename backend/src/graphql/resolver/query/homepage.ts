import { GraphQLContext } from '../../../lib/context';
import { GraphQLError } from 'graphql';
import { getHomepageData } from '../../../services/listingServices';

export const homepageQueries = {
  Query: {
    listingsWithCategories: async (
      _: unknown,
      __: unknown,
      context: GraphQLContext,
    ) => {
      const userId = context.userId;
      try {
        if (!userId) {
          throw new GraphQLError('Try');
        }

        const data = await getHomepageData();
        return {
          message: 'Successfully retrieved listings.',
          homepageData: {
            listings: data.listings,
            categories: data.categories,
          },
        };
      } catch (err) {
        if (err instanceof GraphQLError) {
          throw err;
        }
      }
    },
  },
};

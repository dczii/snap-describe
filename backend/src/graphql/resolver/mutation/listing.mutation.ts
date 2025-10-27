import { GraphQLError } from 'graphql';
import { GraphQLContext } from '../../../lib/context';
import { uploadProductListing } from '../../../services/listingServices';
import { Listing_Condition } from '../../../generated/graphql';
//simple flow for now
export const listingMutations = {
  Mutation: {
    createListing: async (
      _: unknown,
      args: {
        data: {
          title: string;
          description: string;
          price: number;
          qty: number;
          condition: Listing_Condition;
          categoryId: number;
          notes: string;
          imageFilePaths: string[];
        };
      },
      context: GraphQLContext,
    ) => {
      //simple auth check for now
      const userId = context.userId;
      try {
        return await uploadProductListing({ userId, ...args.data });
      } catch (err) {
        if (err instanceof GraphQLError) {
          throw err;
        }

        throw new GraphQLError('Unexpected error occurred', {
          extensions: {
            code: 'UNEXPECTED_ERROR',
          },
        });
      }
    },
  },
};

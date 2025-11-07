import { GraphQLContext } from '../../../lib/context';
import { getCategoryNames } from '../../../services/categoryServices';


export const categoryQueries = {
  Query: {
    allCategoryNames: async (_: unknown, __: unknown, context: GraphQLContext) => {
        const userId = context.userId;
        try {
            if (!userId) throw new Error("Try");
            const categories = await getCategoryNames();
            return {
                message: "Successfully retrieved category names",
                categories
            }
        } catch (err) {
            throw err
        }
    },
  },
};
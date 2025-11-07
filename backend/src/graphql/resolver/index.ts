import { listingMutations } from "./mutation/listingMutations";
import { categoryQueries } from "./query/categories";
import { homepageQueries } from "./query/homepage";


export const resolvers = {
    Query: {
        ...homepageQueries.Query,
        ...categoryQueries.Query
    },
    Mutation: {
        ...listingMutations.Mutation
    }
};
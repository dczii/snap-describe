import { listingMutations } from "./mutation/listingMutations";
import { homepageQueries } from "./query/homepage";


export const resolvers = {
    Query: {
        ...homepageQueries.Query
    },
    Mutation: {
        ...listingMutations.Mutation
    }
};
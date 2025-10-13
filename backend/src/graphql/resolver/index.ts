import { userQueries } from "./query/user.query";
import { userMutations } from "./mutation/user.mutation";
import { listingMutations } from "./mutation/listing.mutation";


export const resolvers = {
    Query: {
        ...userQueries.Query,
    },
    Mutation: {
        ...userMutations.Mutation,
        ...listingMutations.Mutation
    }
};
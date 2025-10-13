import { mergeTypeDefs } from "@graphql-tools/merge"
import { userSchema } from "./user.typeDefs";
import { listingSchema } from "./listing.typeDefs";

export const typeDefs = mergeTypeDefs([
    userSchema,
    listingSchema
]);
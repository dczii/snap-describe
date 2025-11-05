import { mergeTypeDefs } from "@graphql-tools/merge"
import { listingSchema } from "./listings";
import { homepageSchema } from "./homepage";
import { coreSchema } from "./coreTypeDefs";

export const typeDefs = mergeTypeDefs([
    listingSchema,
    homepageSchema,
    coreSchema
]);
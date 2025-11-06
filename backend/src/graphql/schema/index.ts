import { mergeTypeDefs } from "@graphql-tools/merge"
import { listingSchema } from "./listings";
import { homepageSchema } from "./homepage";
import { coreSchema } from "./coreTypeDefs";
import { categorySchema } from "./categories";

export const typeDefs = mergeTypeDefs([
    listingSchema,
    categorySchema,
    homepageSchema,
    coreSchema
]);
import { mergeTypeDefs } from "@graphql-tools/merge"
import { userSchema } from "./user.typeDefs";

export const typeDefs = mergeTypeDefs([
    userSchema,
]);
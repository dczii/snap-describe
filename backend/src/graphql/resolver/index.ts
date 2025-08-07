import { mergeResolvers } from "@graphql-tools/merge";
import { temporaryUser } from "./query/tempUser";

export const resolvers = mergeResolvers([
    temporaryUser.Query,
]);
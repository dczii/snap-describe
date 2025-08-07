import {mergeTypeDefs} from "@graphql-tools/merge"
import { temporaryUser } from "./tempUser";

export const typeDefs = mergeTypeDefs([
    temporaryUser,
]);
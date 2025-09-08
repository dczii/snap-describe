import {gql} from 'graphql-tag';

export const temporaryUser = gql`
    type TemporaryUser {
        id: ID!
        email: String!
        createdAt: String!
        updatedAt: String!
    }
    
    extend type Query {
        temporaryUsers: [TemporaryUser!]!
        temporaryUser(id: ID!): TemporaryUser
    }
    
    extend type Mutation {
        createTemporaryUser(email: String!): TemporaryUser!
        deleteTemporaryUser(id: ID!): Boolean!
    }
`;
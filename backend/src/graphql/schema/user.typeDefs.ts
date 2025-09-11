import {gql} from 'graphql-tag';

export const userSchema = gql`
    type User {
        id: ID!
    }
    
    type Query {
        getUser: UserOperationResponse!
        getAllUsers: UserOperationResponse!
    }
    
    type Mutation {
        createUser: UserOperationResponse!
    }

    type UserOperationResponse {
        success: Boolean!
        message: String!
        data: [User]
    }
`;
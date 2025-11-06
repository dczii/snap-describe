import { gql } from 'graphql-tag';

export const listingSchema = gql`
  type Query {
    getAllListings: ListingOperationResponse!
  }

  type Mutation {
    createListing(data: CreateListingInput!): ListingOperationResponse!
  }

  type ListingOperationResponse {
    message: String
    listings: [Listing!]
  }

  input CreateListingInput {
    title: String!
    description: String!
    price: Float!
    qty: Int!
    condition: listingCondition!
    categoryId: Int!
    notes: String!
    imageFilePaths: [String!]!
  }
`;

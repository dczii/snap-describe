import {gql} from "graphql-tag"

export const listingSchema = gql`
  #   enum listing_Condition {
  #     New
  #     Like
  #     New
  #     Used
  #     Fair
  #   }

  enum listingStatus {
    Available
    Sold
  }

  type Listings {
    id: Int!
    sellerId: ID!
    title: String!
    description: String!
    price: Float!
    qty: Int!
    condition: String!
    categoryId: Int!
    notes: String
    status: listingStatus!
    createdAt: String
  }

  type ListingPhotos {
    id: Int!
    listingId: Int!
    imageUrl: String!
    sortOrder: Int!
  }

  type Query {
    getAllListings: ListingOperationResponse!
  }

  type Mutation {
    createListing(data: CreateListingInput!): ListingOperationResponse!
  }

  #Response
  type ListingOperationResponse {
    message: String
    data: [Listings!]
  }

  #Inputs
  input CreateListingInput {
    title: String!
    description: String!
    price: Float!
    qty: Int!
    condition: String!
    categoryId: Int!
    notes: String!
    imageFilePaths: [String!]!
  }
`;
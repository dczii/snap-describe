import {gql} from "graphql-tag"

export const homepageSchema = gql`
  extend type Listing {
    city: String
    fileUrl: String
  }
  
  type Homepage {
    listings: [Listing!]
    categories: [Category!]
  }

  type Query {
    listingsWithCategories: HomepageOperationResponse!
  }

  type HomepageOperationResponse {
    message: String!
    homepageData: Homepage!
  }
`;
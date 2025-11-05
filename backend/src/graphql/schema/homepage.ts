import {gql} from "graphql-tag"

export const homepageSchema = gql`
  extend type Listing {
    city: String
    fileurl: String
  }
  
  type Homepage {
    listings: [Listing!]
    categories: [Category!]
  }

  type Query {
    getListingsWithCategories: HomepageOperationResponse!
  }

  type HomepageOperationResponse {
    message: String!
    data: Homepage!
  }
`;
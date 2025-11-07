import { gql } from 'graphql-tag';

export const categorySchema = gql`
  type Query {
    allCategoryNames: CategoryOperationResponse!
    
  }

  type CategoryOperationResponse {
    message: String
    categories: [Category!]
  }
`;  
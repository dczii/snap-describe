import {gql} from 'graphql-tag';

export const productSchema = gql`
    type Product {
        name: String
    }
`
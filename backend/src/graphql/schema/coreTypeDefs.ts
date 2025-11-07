import { gql } from 'graphql-tag';

export const coreSchema = gql`
    #Listings
    type Listing {
        id: Int!
        sellerId: ID!
        title: String!
        description: String!
        price: Float!
        qty: Int!
        condition: listingCondition!
        categoryId: Int!
        notes: String
        status: listingStatus!
        createdAt: String
    }

    type ListingPhoto {
        id: Int!
        listingId: Int!
        imageUrl: String!
        sortOrder: Int!
    }

    enum listingCondition {
        New
        Like
        Used
        Fair
    }

    enum listingStatus {
     Available
     Sold
    }
    
    #Categories
    type Category {
        id: Int
        name: String!
        slug: String
        parentId: Int
    }
`;

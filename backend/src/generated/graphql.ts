export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Category = {
  __typename?: 'Category';
  id?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  parentId?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
};

export type CategoryOperationResponse = {
  __typename?: 'CategoryOperationResponse';
  data?: Maybe<Array<Category>>;
  message?: Maybe<Scalars['String']['output']>;
};

export type CreateListingInput = {
  categoryId: Scalars['Int']['input'];
  condition: ListingCondition;
  description: Scalars['String']['input'];
  imageFilePaths: Array<Scalars['String']['input']>;
  notes: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  qty: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type Homepage = {
  __typename?: 'Homepage';
  categories?: Maybe<Array<Category>>;
  listings?: Maybe<Array<Listing>>;
};

export type HomepageOperationResponse = {
  __typename?: 'HomepageOperationResponse';
  data: Homepage;
  message: Scalars['String']['output'];
};

export type Listing = {
  __typename?: 'Listing';
  categoryId: Scalars['Int']['output'];
  city?: Maybe<Scalars['String']['output']>;
  condition: ListingCondition;
  createdAt?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  fileUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  price: Scalars['Float']['output'];
  qty: Scalars['Int']['output'];
  sellerId: Scalars['ID']['output'];
  status: ListingStatus;
  title: Scalars['String']['output'];
};

export type ListingOperationResponse = {
  __typename?: 'ListingOperationResponse';
  data?: Maybe<Array<Listing>>;
  message?: Maybe<Scalars['String']['output']>;
};

export type ListingPhoto = {
  __typename?: 'ListingPhoto';
  id: Scalars['Int']['output'];
  imageUrl: Scalars['String']['output'];
  listingId: Scalars['Int']['output'];
  sortOrder: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createListing: ListingOperationResponse;
};


export type MutationCreateListingArgs = {
  data: CreateListingInput;
};

export type Query = {
  __typename?: 'Query';
  allCategoryNames: CategoryOperationResponse;
  getAllListings: ListingOperationResponse;
  listingsWithCategories: HomepageOperationResponse;
};

export enum ListingCondition {
  Fair = 'Fair',
  Like = 'Like',
  New = 'New',
  Used = 'Used'
}

export enum ListingStatus {
  Available = 'Available',
  Sold = 'Sold'
}

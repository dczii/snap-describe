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

export type CreateListingInput = {
  categoryId: Scalars['Int']['input'];
  condition: Listing_Condition;
  description: Scalars['String']['input'];
  imageFilePaths: Array<Scalars['String']['input']>;
  notes: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  qty: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type ListingOperationResponse = {
  __typename?: 'ListingOperationResponse';
  data?: Maybe<Array<Listings>>;
  message?: Maybe<Scalars['String']['output']>;
};

export type ListingPhotos = {
  __typename?: 'ListingPhotos';
  id: Scalars['Int']['output'];
  imageUrl: Scalars['String']['output'];
  listingId: Scalars['Int']['output'];
  sortOrder: Scalars['Int']['output'];
};

export type Listings = {
  __typename?: 'Listings';
  categoryId: Scalars['Int']['output'];
  condition: Listing_Condition;
  createdAt?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  price: Scalars['Float']['output'];
  qty: Scalars['Int']['output'];
  sellerId: Scalars['ID']['output'];
  status: ListingStatus;
  title: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createListing: ListingOperationResponse;
  createUser: UserOperationResponse;
};


export type MutationCreateListingArgs = {
  data: CreateListingInput;
};

export type Product = {
  __typename?: 'Product';
  name?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  getAllListings: ListingOperationResponse;
  getAllUsers: UserOperationResponse;
  getUser: UserOperationResponse;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
};

export type UserOperationResponse = {
  __typename?: 'UserOperationResponse';
  data?: Maybe<Array<Maybe<User>>>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export enum ListingStatus {
  Available = 'Available',
  Sold = 'Sold'
}

export enum Listing_Condition {
  Fair = 'Fair',
  Like = 'Like',
  New = 'New',
  Used = 'Used'
}

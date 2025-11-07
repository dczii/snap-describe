export const CreateListMutation = `
  mutation createListing($data: CreateListingInput!) {
    createListing(data: $data) {
      message
    }
  }
`;

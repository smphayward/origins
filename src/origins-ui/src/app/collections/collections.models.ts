// Only includes info that actually goes into the repository
export interface Collection {
  id: string;
  rootDirectory: string;
}

// Includes extra info given back by the server
// This is NOT information required for create/update operations
export interface CollectionInfo extends Collection {
  exists?: boolean;
}
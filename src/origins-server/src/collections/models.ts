import { Document } from "../documents/Document";

export interface Collection extends Document {
  id: string;
  rootDirectory: string;
}

export type CollectionDictionary = { [collectionId: string]: Collection  };
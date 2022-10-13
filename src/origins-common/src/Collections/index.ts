import { OriginsDocument } from "..";

// ----- Document Types ----- //
export interface Collection extends OriginsDocument {
  name: string;
  rootDirectory: string;
}

export interface CollectionInfo extends Collection {
  rootDirectoryExists: boolean;
}


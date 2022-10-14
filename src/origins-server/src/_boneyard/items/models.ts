// interface Link {
//   _href: string;
// }

// export interface Document {
//   id: string;
// }

// export interface MultipleDocumentsResult<TDocument extends Document> {
//   documents: TDocument[];
//   continuationToken?: string;
// }



// import { Document } from "../documents/models";

// // What gets stored in Elasticsearch
// export interface Item extends Document {
//   id: string;
//   rootDirectory: string;
// }

// // What gets given back from the server via REST API
// export interface ItemInfo extends Item {
//   rootDirectoryExists?: boolean;
// }

// export type ItemDictionary = { [itemId: string]: Item };

// export enum ItemFields {
//   id = "id",
//   collectionId = "collectionId",
//   collectionDirectory = "collectionDirectory",
//   fileRelativePath = "fileRelativePath",
//   fileAbsolutePath = "fileAbsolutePath",
//   fileSizeBytes = "fileSizeBytes",
//   fileCreated = "fileCreated",
//   fileModified = "fileModified",
//   filename = "filename",
//   fileExtension = "fileExtension",
// }
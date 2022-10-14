// import {
//   DeleteDocumentResult,
//   GetDocumentResult,
//   GetDocumentsResult, 
//   UpsertDocumentResult,
//   OriginsDocument,
// } from "origins-common";

// export interface DocumentSortCondition {
//   field: string;
//   order: "asc" | "desc"
// }

// export interface DocumentProvider<TDocument extends OriginsDocument> {
//   getAll: (
//     maxResults?: number,
//     continuationToken?: string | null,
//     sort?: DocumentSortCondition[]
//   ) => Promise<GetDocumentsResult<TDocument>>;
//   get: (id: string) => Promise<GetDocumentResult<TDocument>>;
//   put: (collection: TDocument) => Promise<UpsertDocumentResult<TDocument>>;
//   delete: (id: string) => Promise<DeleteDocumentResult>;
//   search: (
//     lucene: string,
//     maxResults?: number,
//     continuationToken?: string | null,
//     sort?: DocumentSortCondition[]
//   ) => Promise<GetDocumentsResult<TDocument>>;
// }
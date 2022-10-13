// ----- Document Types ----- //
export interface OriginsDocument {
  id: string;
}

export interface Link {
  _href: string;
}

// ----- HTTP Response ----- //
export interface GeneralResult {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface GetDocumentResult<TDocument extends OriginsDocument> extends GeneralResult {
  document?: TDocument;
  continuationToken?: string;
}

export interface GetDocumentsResult<TDocument extends OriginsDocument> extends GeneralResult {
  documents?: Array<TDocument>;
  continuationToken?: string;
}

export interface AddDocumentResult<TDocument extends OriginsDocument> extends GeneralResult {
  documents?: TDocument;
}

export interface UpdateDocumentResult<TDocument extends OriginsDocument> extends GeneralResult {
  documents?: TDocument;
}

export interface DeleteDocumentResult extends GeneralResult {
  // Might be some stuff here at some point
  // Some systems return the record that was deleted
}
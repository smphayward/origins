interface Link {
  _href: string;
}

export interface Document {
  id: string;
}

export interface MultipleDocumentsResult<TDocument extends Document> {
  documents: TDocument[];
  continuationToken?: string;
}
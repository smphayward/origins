import {Document, MultipleDocumentsResult} from './models';

export interface DocumentSortCondition {
  field: string;
  order: "asc" | "desc"
}

export interface DocumentProvider<TDocument extends Document> {
  getAll: (
    maxResults?: number,
    continuationToken?: string | null,
    sort?: DocumentSortCondition[]
  ) => Promise<MultipleDocumentsResult<TDocument>>;
  get: (id: string) => Promise<TDocument | null>;
  put: (collection: TDocument) => Promise<TDocument>;
  delete: (id: string) => Promise<boolean>;
  search: (
    lucene: string,
    maxResults?: number,
    continuationToken?: string | null,
    sort?: DocumentSortCondition[]
  ) => Promise<MultipleDocumentsResult<TDocument>>;
}
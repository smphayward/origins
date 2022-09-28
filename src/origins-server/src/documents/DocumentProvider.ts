import {Document} from './Document';

export interface DocumentProvider<TDocument extends Document>  {
  getAll: () => Promise<TDocument[]>;
  get: (id: string) => Promise<TDocument | null>;
  put: (collection: TDocument) => Promise<TDocument>;
  delete: (id: string) => Promise<boolean>;
  search: (lucene: string) => Promise<TDocument[]>;
}
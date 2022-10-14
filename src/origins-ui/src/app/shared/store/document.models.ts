import { OriginsDocument } from 'origins-common';

export interface DocumentState<TDocument extends OriginsDocument> {
  documents: TDocument[];
  moreDocumentsAvailable: boolean;

  selectedDocumentIndex?: number;
  selectedDocument?: TDocument;

}
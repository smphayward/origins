import { Observable } from 'rxjs';

// ███    ███  ██████  ██████  ███████ ██      ███████ 
// ████  ████ ██    ██ ██   ██ ██      ██      ██      
// ██ ████ ██ ██    ██ ██   ██ █████   ██      ███████ 
// ██  ██  ██ ██    ██ ██   ██ ██      ██           ██ 
// ██      ██  ██████  ██████  ███████ ███████ ███████ 

export interface OriginsDocument {
  id: string;
}

export interface Link {
  _href: string;
}

// ██████  ██████   ██████  ██    ██ ██ ██████  ███████ ██████  
// ██   ██ ██   ██ ██    ██ ██    ██ ██ ██   ██ ██      ██   ██ 
// ██████  ██████  ██    ██ ██    ██ ██ ██   ██ █████   ██████  
// ██      ██   ██ ██    ██  ██  ██  ██ ██   ██ ██      ██   ██ 
// ██      ██   ██  ██████    ████   ██ ██████  ███████ ██   ██ 


export interface DocumentSortCondition {
  field: string;
  order: "asc" | "desc"
}

export interface DocumentProvider<
  TDocumentForRead extends OriginsDocument,
  TDocumentForWrite extends OriginsDocument = TDocumentForRead,
> {
  getAll: (
    maxResults?: number,
    continuationToken?: string | null,
    sort?: DocumentSortCondition[],
  ) => Promise<GetDocumentsResponse<TDocumentForRead>>;
  get: (id: string) => Promise<GetDocumentResponse<TDocumentForRead>>;
  put: (collection: TDocumentForWrite) => Promise<UpsertDocumentResponse<TDocumentForWrite>>;
  delete: (id: string) => Promise<DeleteDocumentResponse>;
  search: (
    lucene: string,
    maxResults?: number,
    continuationToken?: string | null,
    sort?: DocumentSortCondition[],
  ) => Promise<GetDocumentsResponse<TDocumentForWrite>>;
}

export interface ObservableDocumentProvider<
  TDocumentForRead extends OriginsDocument,
  TDocumentForWrite extends OriginsDocument = TDocumentForRead,
> {
  getAll: (
    maxResults?: number,
    continuationToken?: string | null,
    sort?: DocumentSortCondition[],
  ) => Observable<GetDocumentsResponse<TDocumentForRead>>;
  get: (id: string) => Observable<GetDocumentResponse<TDocumentForRead>>;
  put: (collection: TDocumentForWrite) => Observable<UpsertDocumentResponse<TDocumentForWrite>>;
  delete: (id: string) => Observable<DeleteDocumentResponse>;
  search: (
    lucene: string,
    maxResults?: number,
    continuationToken?: string | null,
    sort?: DocumentSortCondition[],
  ) => Observable<GetDocumentsResponse<TDocumentForWrite>>;
}



// ██████  ███████ ███████ ██████   ██████  ███    ██ ███████ ███████ 
// ██   ██ ██      ██      ██   ██ ██    ██ ████   ██ ██      ██      
// ██████  █████   ███████ ██████  ██    ██ ██ ██  ██ ███████ █████   
// ██   ██ ██           ██ ██      ██    ██ ██  ██ ██      ██ ██      
// ██   ██ ███████ ███████ ██       ██████  ██   ████ ███████ ███████ 

export interface GeneralResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

export interface DocumentResponse<TDocument extends OriginsDocument> extends GeneralResponse {
  document?: TDocument;
}

export interface GetDocumentResponse<TDocument extends OriginsDocument> extends DocumentResponse<TDocument> {}

export interface GetDocumentsResponse<TDocument extends OriginsDocument> extends GeneralResponse {
  documents?: Array<TDocument>;
  continuationToken?: string;
}

export interface UpsertDocumentResponse<TDocument extends OriginsDocument> extends DocumentResponse<TDocument> {}

export interface AddDocumentResponse<TDocument extends OriginsDocument> extends DocumentResponse<TDocument> {}

export interface UpdateDocumentResponse<TDocument extends OriginsDocument> extends DocumentResponse<TDocument> {}

export interface DeleteDocumentResponse extends GeneralResponse {
  // Might be some stuff here at some point
  // Some systems return the record that was deleted
}


// ███████  █████   ██████ ████████  ██████  ██████  ██    ██ 
// ██      ██   ██ ██         ██    ██    ██ ██   ██  ██  ██  
// █████   ███████ ██         ██    ██    ██ ██████    ████   
// ██      ██   ██ ██         ██    ██    ██ ██   ██    ██    
// ██      ██   ██  ██████    ██     ██████  ██   ██    ██    


class GetDocumentsResponseFactory<TDocument extends OriginsDocument> {
  custom = (
    success: boolean,
    statusCode: number,
    message: string,
    continuationToken?: string,
    documents?: TDocument[],
  ): GetDocumentsResponse<TDocument> => {
    return {
      success,
      statusCode,
      message,
      continuationToken,
      documents,
    };
  };

  ok = (
    documents: TDocument[],
    continuationToken: string | undefined = undefined,
    message: string = `Documents found.`,
  ) => this.custom(true, 200, message, continuationToken, documents);
  notFound = (message: string = `Documents not found.`) => this.custom(false, 404, message);
}

class DocumentResponseFactory<TDocument extends OriginsDocument> {
  custom = (
    success: boolean,
    statusCode: number,
    message: string,
    document?: TDocument,
  ): GetDocumentResponse<TDocument> => {
    return {
      success,
      statusCode,
      message,
      document,
    };
  };

  ok = (document: TDocument, message: string = `Document found.`) => this.custom(true, 200, message, document);
  notFound = (message: string = `Document not found.`) => this.custom(false, 404, message);
  internalServerError = (message: string = `Internal server error.`) => this.custom(false, 500, message);
}

class GetDocumentResponseFactory<TDocument extends OriginsDocument> extends DocumentResponseFactory<TDocument> {

} 

class UpsertDocumentResponseFactory<TDocument extends OriginsDocument> extends DocumentResponseFactory<TDocument> {

} 

class AddDocumentResponseFactory<TDocument extends OriginsDocument> extends DocumentResponseFactory<TDocument> {

}

class UpdateDocumentResponseFactory<TDocument extends OriginsDocument> extends DocumentResponseFactory<TDocument> {

}

class GeneralResponseResponseFactory {

  custom = (
    success: boolean,
    statusCode: number,
    message: string,
  ): GeneralResponse => {
    return {
      success,
      statusCode,
      message,
    };
  };

  notFound = (message: string = 'Document not found.') => this.custom(false, 404, message);
  ok = (message: string = '') => this.custom(true, 200, message);

}

class DeleteDocumentResponseFactory<TDocument extends OriginsDocument> extends GeneralResponseResponseFactory {

}

export class ResponseFactory<TDocument extends OriginsDocument> {
  readonly getDocuments = new GetDocumentsResponseFactory<TDocument>();

  readonly document = new DocumentResponseFactory<TDocument>();
  readonly getDocument = new GetDocumentResponseFactory<TDocument>();
  readonly upsertDocument = new UpsertDocumentResponseFactory<TDocument>();
  readonly addDocument = new AddDocumentResponseFactory<TDocument>();
  readonly updateDocument = new UpdateDocumentResponseFactory<TDocument>();

  readonly deleteDocument = new DeleteDocumentResponseFactory<TDocument>();
  
}

import { Observable, of, map } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

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
  purge: () => Promise<PurgeResponse>;
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
  put: (document: TDocumentForWrite) => Observable<UpsertDocumentResponse<TDocumentForRead>>;
  delete: (id: string) => Observable<DeleteDocumentResponse>;
  search: (
    lucene: string,
    maxResults?: number,
    continuationToken?: string | null,
    sort?: DocumentSortCondition[],
  ) => Observable<GetDocumentsResponse<TDocumentForRead>>;
  purge: () => Observable<PurgeResponse>;
}

// ███    ███  ██████   ██████ ██   ██ 
// ████  ████ ██    ██ ██      ██  ██  
// ██ ████ ██ ██    ██ ██      █████   
// ██  ██  ██ ██    ██ ██      ██  ██  
// ██      ██  ██████   ██████ ██   ██ 

export abstract class MockObservableDocumentProvider<
TDocumentForRead extends OriginsDocument,
  TDocumentForWrite extends OriginsDocument = TDocumentForRead
> implements ObservableDocumentProvider<TDocumentForRead, TDocumentForWrite>
{
  private _maxResults = 60;

  constructor(private _documents: Array<TDocumentForRead>) {}

  getAll(
    maxResults?: number,
    continuationToken?: string | null,
    sort?: DocumentSortCondition[],
  ): Observable<GetDocumentsResponse<TDocumentForRead>> {
    console.log('Mock repository get all');

    // Figure out continuation
    let startAt = 0;
    if (continuationToken) {
      startAt = Number(continuationToken);
    }
    console.log(
      `Getting up to ${this._maxResults} documents starting at index ${startAt} from total of ${this._documents.length} possible records`
    );

    // Get the records
    const documents = this._documents.slice(startAt, startAt + this._maxResults);
    console.log(`Got ${documents.length} documents.`);

    // Build the Next Continuation Token
    const nextStartIndex = startAt + this._maxResults;
    let nextContinuationToken: string | undefined = nextStartIndex.toString();
    if (nextStartIndex >= this._documents.length) {
      nextContinuationToken = undefined;
    }

    // Return the result
    return of({
      success: true,
      statusCode: 200,
      message: 'Documents successfully retrieved',
      continuationToken: nextContinuationToken,
      documents,
    });

  }

  get(id: string): Observable<GetDocumentResponse<TDocumentForRead>>  {
    const existingIndex = this._documents.findIndex((r) => r.id === id);
    if(existingIndex === -1){
      return of({
        success: false,
        statusCode: 404,
        message: `Document with id ${id} not found`,
        document: undefined,
      });
    }
    return of({
      success: true,
      statusCode: 200,
      message: `Document with id ${id} found`,
      document: this._documents[existingIndex],
    });
  }

  search(
    lucene: string,
    maxResults?: number,
    continuationToken?: string | null,
    sort?: DocumentSortCondition[],
  ): Observable<GetDocumentsResponse<TDocumentForRead>> {
    console.log('Mock repository search');
    return this.getAll(maxResults, continuationToken).pipe(
      map((result) => ({
        ...result,
        records: result.documents?.filter((document) => {
          const r = document as any;
          Object.keys(document)
            .map((key) => r[key])
            .some((value) => {
              const s = value as string;
              if (s) {
                return s.indexOf(lucene) >= 0;
              }
              return false;
            });
        }),
      }))
    );
  }

  put(document: TDocumentForWrite): Observable<UpsertDocumentResponse<TDocumentForRead>> {
    let id = document.id;
    if(id.trim().length === 0){
      id = uuidv4();
    }

    // Add new
    const existingIndex = this._documents.findIndex((r) => r.id === id);
    if (existingIndex === -1) {
      const temp = this.getDocumentForRead({
        ...document,
        id: uuidv4(),
      });
      this._documents.push(temp);
      return of({
        success: true,
        statusCode: 201,
        message: `Document ${id} created successfully.`,
        document: temp,
      });
    }

    // Update existing
    const documentForRead = this.getDocumentForRead(document);
    this._documents[existingIndex] = documentForRead;
    return of({
      success: true,
      statusCode: 200,
      message: `Document ${id} updated successfully`,
      document: documentForRead,
    });
  }

  delete(id: string): Observable<DeleteDocumentResponse> {
    const index = this._documents.findIndex((record) => record.id === id);
    if (index === -1) {
      return of({
        success: false,
        statusCode: 404,
        message: 'Document not found.',
      });
    }
    this._documents.splice(index, 1);
    return of({
      success: true,
      statusCode: 200,
      message: 'Document successfully deleted.',
    });

    // TODO: Remove the item from the in-memory mock array of data
    // Split and spreading?
  }

  purge(): Observable<PurgeResponse> {
    this._documents = [];
    return of({
      success: true,
      statusCode: 200,
      message: 'Successfully purged.',
    });
  }

  // ----- PROTECTED ABSTRACT ----- //
  protected abstract getDocumentForRead(document: TDocumentForWrite): TDocumentForRead;
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

export interface PurgeResponse extends GeneralResponse {
  // Might be some stuff here at some point
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

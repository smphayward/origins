import { catchError, map, Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {
  AddDocumentResponse,
  DeleteDocumentResponse,
  DocumentSortCondition,
  GetDocumentResponse,
  GetDocumentsResponse,
  ObservableDocumentProvider,
  OriginsDocument,
  ProcessDocumentsResponse,
  PurgeDocumentsResponse,
  UpsertDocumentResponse,
} from 'origins-common';

export abstract class HttpDocumentProvider<
  TDocumentForRead extends OriginsDocument,
  TDocumentForWrite extends OriginsDocument
> implements ObservableDocumentProvider<TDocumentForRead, TDocumentForWrite>
{
  constructor(
    private http: HttpClient,
    // Example: '/api/index' or '/api/collection'
    private urlRoot: string
  ) {}

  // ██████  ███████  █████  ██████
  // ██   ██ ██      ██   ██ ██   ██
  // ██████  █████   ███████ ██   ██
  // ██   ██ ██      ██   ██ ██   ██
  // ██   ██ ███████ ██   ██ ██████

  getAll(
    maxResults?: number,
    continuationToken?: string | null,
    sort?: DocumentSortCondition[]
  ): Observable<GetDocumentsResponse<TDocumentForRead>> {
    let url = `${this.urlRoot}?max=${maxResults}`;
    if (continuationToken) {
      url += `&continue=${continuationToken}`;
    }
    return this.http.get<GetDocumentsResponse<TDocumentForRead>>(url);
  }

  get(id: string): Observable<GetDocumentResponse<TDocumentForRead>> {
    let url = `${this.urlRoot}/${id}`;
    return this.http.get<GetDocumentResponse<TDocumentForRead>>(url);
  }

  search(
    lucene: string,
    maxResults?: number,
    continuationToken?: string | null,
    sort?: DocumentSortCondition[]
  ): Observable<GetDocumentsResponse<TDocumentForRead>> {
    // Give back nothing if no query given
    if (!lucene || lucene.trim().length === 0) {
      return of({
        success: false,
        statusCode: 400,
        message: 'query cannot be empty.',
      });
    }
    let url = `${this.urlRoot}/search?q=${encodeURI(lucene)}&max=${maxResults}`;
    if (continuationToken) {
      url += `&continue=${continuationToken}`;
    }
    return this.http.get<GetDocumentsResponse<TDocumentForRead>>(url);
  }

  // ██     ██ ██████  ██ ████████ ███████
  // ██     ██ ██   ██ ██    ██    ██
  // ██  █  ██ ██████  ██    ██    █████
  // ██ ███ ██ ██   ██ ██    ██    ██
  //  ███ ███  ██   ██ ██    ██    ███████

  put(
    document: TDocumentForWrite
  ): Observable<AddDocumentResponse<TDocumentForRead>> {
    let id = document.id;
    if (id.trim().length === 0) {
      id = uuidv4();
    }

    const newRecord = {
      ...document,
      id,
    };
    return this.http
      .put<TDocumentForRead>(`${this.urlRoot}/${id}`, newRecord, {
        observe: 'response',
      })
      .pipe(map(this.httpResponseToUpsertResponse));
  }

  delete(id: string): Observable<DeleteDocumentResponse> {
    return this.http
      .delete(`${this.urlRoot}/${id}`, { observe: 'response' })
      .pipe(map(this.httpResponseToDeleteResponse));
  }

  // ██████  ██    ██ ██████   ██████  ███████
  // ██   ██ ██    ██ ██   ██ ██       ██
  // ██████  ██    ██ ██████  ██   ███ █████
  // ██      ██    ██ ██   ██ ██    ██ ██
  // ██       ██████  ██   ██  ██████  ███████

  purge(lucene?: string): Observable<PurgeDocumentsResponse> {
    let url = `${this.urlRoot}/purge`;
    if (lucene && lucene.trim().length > 0) {
      url += `?q=${encodeURI(lucene)}`;
    }

    return (
      this.http
        .post(url, { observe: 'response' })
        // This mapping is wrong.
        // For some reason, post doesn't give HttpResponse
        .pipe(
          map((x) => ({
            statusCode: 200,
            message: 'Done',
            success: true,
          }))
        )
    );
  }

  // ██████  ██████   ██████   ██████ ███████ ███████ ███████
  // ██   ██ ██   ██ ██    ██ ██      ██      ██      ██
  // ██████  ██████  ██    ██ ██      █████   ███████ ███████
  // ██      ██   ██ ██    ██ ██      ██           ██      ██
  // ██      ██   ██  ██████   ██████ ███████ ███████ ███████

  process(id: string): Observable<ProcessDocumentsResponse> {
    return (
      this.http
        .post(`${this.urlRoot}/${encodeURI(id)}/process`, { observe: 'response' })
        // This mapping is wrong.
        // For some reason, post doesn't give HttpResponse
        .pipe(
          map((x) => ({
            statusCode: 200,
            message: 'Done',
            success: true,
          }))
        )
    );
  }


  // ██   ██ ███████ ██      ██████  ███████ ██████  ███████
  // ██   ██ ██      ██      ██   ██ ██      ██   ██ ██
  // ███████ █████   ██      ██████  █████   ██████  ███████
  // ██   ██ ██      ██      ██      ██      ██   ██      ██
  // ██   ██ ███████ ███████ ██      ███████ ██   ██ ███████

  private httpResponseToUpsertResponse(
    res: HttpResponse<TDocumentForRead> | any
  ): UpsertDocumentResponse<TDocumentForRead> {
    if (res instanceof HttpResponse<UpsertDocumentResponse<TDocumentForRead>>) {
      return res.body;
    }
    return {
      success: false,
      statusCode: 500,
      message: `unknown response adding record. ${JSON.stringify(res)}`,
      document: undefined,
    };
  }

  private httpResponseToDeleteResponse(
    res: HttpResponse<Object>
  ): DeleteDocumentResponse {
    if (res instanceof HttpResponse<Object>) {
      return {
        success: res.status < 400,
        statusCode: res.status,
        message: res.statusText,
      };
    }
    return {
      success: false,
      statusCode: 500,
      message: `unknown response deleting document. ${JSON.stringify(res)}`,
    };
  }

  private httpResponseToPurgeResponse(
    res: HttpResponse<Object>
  ): PurgeDocumentsResponse {
    if (res instanceof HttpResponse<Object>) {
      return {
        success: res.status < 400,
        statusCode: res.status,
        message: res.statusText,
      };
    }
    return {
      success: false,
      statusCode: 500,
      message: `unknown response deleting document. ${JSON.stringify(res)}`,
    };
  }
}

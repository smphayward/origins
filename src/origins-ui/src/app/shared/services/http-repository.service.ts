import { catchError, map, Observable, of } from 'rxjs';
import { OriginsRecord } from '../models/record';
import { AddResult, DeleteResult, GetManyResult, UpdateResult } from '../models/repository-results';
import { RecordRepositoryService } from './record-repository.service';
import { v4 as uuidv4 } from 'uuid';
import { HttpClient, HttpResponse } from '@angular/common/http';

export abstract class HttpRepositoryService<
  TRecordForRead extends OriginsRecord,
  TRecordForWrite extends OriginsRecord
> implements RecordRepositoryService<TRecordForRead, TRecordForWrite>
{
  private _maxResults = 60;

  constructor(
    private http: HttpClient,
    // Example: '/api/index' or '/api/collection'
    private urlRoot: string) {}

  getAll(continuationToken?: string): Observable<GetManyResult<TRecordForRead>> {
    let url=`${this.urlRoot}?max=${this._maxResults}`;
    if(continuationToken){
      url += `&continue=${continuationToken}`;
    }
    return this.http
      .get<GetManyResult<TRecordForRead>>(url);
  }

  search(query: string, continuationToken?: string): Observable<GetManyResult<TRecordForRead>> {
    // Give back nothing if no query given
    if(!query || query.trim().length === 0) {
      return of({
        success: false,
        statusCode: 400,
        message: 'query cannot be empty.',
      });
    }
    let url = `${this.urlRoot}/search?q=${encodeURI(query)}&max=${this._maxResults}`;
    if(continuationToken){
      url += `&continue=${continuationToken}`;
    }
    return this.http
      .get<GetManyResult<TRecordForRead>>(url);
  }

  add (record: TRecordForWrite): Observable<AddResult<TRecordForRead>> {

    const id = uuidv4();
    const newRecord = {
      ...record,
      id
    };
    return this.http
      .put<TRecordForRead>(`${this.urlRoot}/${id}`, newRecord, { observe: 'response' })
      .pipe(
        map(this.responseToAddResult),
      );
  }

  update (record: TRecordForWrite): Observable<UpdateResult<TRecordForRead>>{
    return this.http
      .put<TRecordForRead>(`${this.urlRoot}/${record.id}`, record, { observe: 'response' })
      .pipe(
        map(this.responseToUpdateResult),
      );
  }

  deleteById (id: string):  Observable<DeleteResult>{
    return this.http
      .delete(`${this.urlRoot}/${id}`, { observe: 'response' })
      .pipe(
        map(this.responseToDeleteResult),
      );
  }

  // ----- HELPERS ----- //
  private responseToAddResult(res: HttpResponse<TRecordForRead> | any): AddResult<TRecordForRead> {
    if(res instanceof HttpResponse<TRecordForRead> ){
      return {
        success: res.status < 400,
        statusCode: res.status,
        message: res.statusText,
        record: res.body ?? undefined
      }
    }
    return {
      success: false,
      statusCode: 500,
      message: `unknown response adding record. ${JSON.stringify(res)}`,
      record: undefined
    }
  }

  private responseToUpdateResult(res: HttpResponse<TRecordForRead>): UpdateResult<TRecordForRead> {
    if(res instanceof HttpResponse<TRecordForRead> ){
      return {
        success: res.status < 400,
        statusCode: res.status,
        message: res.statusText,
        record: res.body ?? undefined
      }
    }
    return {
      success: false,
      statusCode: 500,
      message: `unknown response updating record. ${JSON.stringify(res)}`,
      record: undefined
    }
  }  

  private responseToDeleteResult(res: HttpResponse<Object>): DeleteResult {
    if(res instanceof HttpResponse<TRecordForRead> ){
      return {
        success: res.status < 400,
        statusCode: res.status,
        message: res.statusText,
      }
    }
    return {
      success: false,
      statusCode: 500,
      message: `unknown response updating record. ${JSON.stringify(res)}`,
    }
  }    

  // getAll(
  //   continuationToken?: string
  // ): Observable<GetManyResult<TRecordForRead>> {

  //   console.log('Http repository get all');

  //   // Figure out continuation
  //   let startAt = 0;
  //   if (continuationToken) {
  //     startAt = Number(continuationToken);
  //   }
  //   console.log(
  //     `Getting up to ${this._maxResults} records starting at index ${startAt} from total of ${this._records.length} possible records`
  //   );

  //   // Get the records
  //   const records = this._records.slice(startAt, startAt + this._maxResults);
  //   console.log(`Got ${records.length} records.`);

  //   // Build the Next Continuation Token
  //   const nextStartIndex = startAt + this._maxResults;
  //   let nextContinuationToken: string | undefined = nextStartIndex.toString();
  //   if (nextStartIndex >= this._records.length) {
  //     nextContinuationToken = undefined;
  //   }

  //   // Return the result
  //   return of({
  //     continuationToken: nextContinuationToken,
  //     records,
  //   });
  // }

  // search(
  //   query: string,
  //   continuationToken?: string
  // ): Observable<GetManyResult<TRecordForRead>> {
  //   console.log('Mock repository search');
  //   return this.getAll(continuationToken).pipe(
  //     map((result) => ({
  //       records: result.records.filter((record) => {
  //         const r = record as any;
  //         Object.keys(record)
  //           .map((key) => r[key])
  //           .some((value) => {
  //             const s = value as string;
  //             if (s) {
  //               return s.indexOf(query) >= 0;
  //             }
  //             return false;
  //           });
  //       }),
  //       continuationToken: result.continuationToken,
  //     }))
  //   );
  // }

  // add(record: TRecordForWrite): Observable<AddResult<TRecordForRead>> {
  //   const recordForRead = this.getRecordForRead(record);
  //   recordForRead.id = uuidv4();
  //   this._records.push(recordForRead);
  //   return of({
  //     success: true,
  //     statusCode: 200,
  //     message: "Record added successfully",
  //     record: recordForRead
  //   });
  // }

  // update(record: TRecordForWrite): Observable<UpdateResult<TRecordForRead>> {

  //   const id = record.id;
  //   const existingIndex = this._records.findIndex(r => r.id === id);
  //   if(existingIndex === -1){
  //     return of({
  //       success: false,
  //       statusCode: 404,
  //       message: `Record with id ${id} not found`,
  //       record: undefined
  //     });      
  //   }

  //   const recordForRead = this.getRecordForRead(record);
  //   this._records[existingIndex] = recordForRead;
  //   return of({
  //     success: true,
  //     statusCode: 200,
  //     message: `Record ${id} updated successfully`,
  //     record: recordForRead
  //   });

  // }

  // deleteById(id: string): Observable<DeleteResult> {
  //   const index = this._records.findIndex((record) => record.id === id);
  //   if (index === -1) {
  //     return of({
  //       success: false,
  //       statusCode: 404,
  //       message: 'Record not found.',
  //     });
  //   }
  //   this._records.splice(index, 1);
  //   return of({
  //     success: true,
  //     statusCode: 200,
  //     message: 'Record successfully deleted.',
  //   });

  //   // TODO: Remove the item from the in-memory mock array of data
  //   // Split and spreading?
  // }

  // // ----- PROTECTED ABSTRACT ----- //
  // protected abstract getRecordForRead(record: TRecordForWrite): TRecordForRead;

}

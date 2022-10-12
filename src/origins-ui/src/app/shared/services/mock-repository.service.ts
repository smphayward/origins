import { map, Observable, of } from 'rxjs';
import { OriginsRecord } from '../models/record';
import {
  AddResult,
  DeleteResult,
  GetManyResult,
  UpdateResult,
} from '../models/repository-results';
import { RecordRepositoryService } from './record-repository.service';
import { v4 as uuidv4 } from 'uuid';

export abstract class MockRepositoryService<
  TRecordForRead extends OriginsRecord,
  TRecordForWrite extends OriginsRecord
> implements RecordRepositoryService<TRecordForRead, TRecordForWrite>
{
  private _maxResults = 60;

  constructor(private _records: Array<TRecordForRead>) {}

  getAll(
    continuationToken?: string
  ): Observable<GetManyResult<TRecordForRead>> {
    console.log('Mock repository get all');

    // Figure out continuation
    let startAt = 0;
    if (continuationToken) {
      startAt = Number(continuationToken);
    }
    console.log(
      `Getting up to ${this._maxResults} records starting at index ${startAt} from total of ${this._records.length} possible records`
    );

    // Get the records
    const records = this._records.slice(startAt, startAt + this._maxResults);
    console.log(`Got ${records.length} records.`);

    // Build the Next Continuation Token
    const nextStartIndex = startAt + this._maxResults;
    let nextContinuationToken: string | undefined = nextStartIndex.toString();
    if (nextStartIndex >= this._records.length) {
      nextContinuationToken = undefined;
    }

    // Return the result
    return of({
      success: true,
      statusCode: 200,
      message: 'Records successfully retrieved',
      continuationToken: nextContinuationToken,
      records,
    });
  }

  search(
    query: string,
    continuationToken?: string
  ): Observable<GetManyResult<TRecordForRead>> {
    console.log('Mock repository search');
    return this.getAll(continuationToken).pipe(
      map((result) => ({
        ...result,
        records: result.records?.filter((record) => {
          const r = record as any;
          Object.keys(record)
            .map((key) => r[key])
            .some((value) => {
              const s = value as string;
              if (s) {
                return s.indexOf(query) >= 0;
              }
              return false;
            });
        }),
      }))
    );
  }

  add(record: TRecordForWrite): Observable<AddResult<TRecordForRead>> {
    const recordForRead = this.getRecordForRead(record);
    recordForRead.id = uuidv4();
    this._records.push(recordForRead);
    return of({
      success: true,
      statusCode: 200,
      message: 'Record added successfully',
      record: recordForRead,
    });
  }

  update(record: TRecordForWrite): Observable<UpdateResult<TRecordForRead>> {
    const id = record.id;
    const existingIndex = this._records.findIndex((r) => r.id === id);
    if (existingIndex === -1) {
      return of({
        success: false,
        statusCode: 404,
        message: `Record with id ${id} not found`,
        record: undefined,
      });
    }

    const recordForRead = this.getRecordForRead(record);
    this._records[existingIndex] = recordForRead;
    return of({
      success: true,
      statusCode: 200,
      message: `Record ${id} updated successfully`,
      record: recordForRead,
    });
  }

  deleteById(id: string): Observable<DeleteResult> {
    const index = this._records.findIndex((record) => record.id === id);
    if (index === -1) {
      return of({
        success: false,
        statusCode: 404,
        message: 'Record not found.',
      });
    }
    this._records.splice(index, 1);
    return of({
      success: true,
      statusCode: 200,
      message: 'Record successfully deleted.',
    });

    // TODO: Remove the item from the in-memory mock array of data
    // Split and spreading?
  }

  // ----- PROTECTED ABSTRACT ----- //
  protected abstract getRecordForRead(record: TRecordForWrite): TRecordForRead;
}

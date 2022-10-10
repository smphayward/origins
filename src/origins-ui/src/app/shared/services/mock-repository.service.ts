import { ArrayDataSource } from '@angular/cdk/collections';
import { TRANSLATIONS } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { GetManyResult } from '../models/repository-results';
import { RecordRepositoryService } from './record-repository.service';

export abstract class MockRepositoryService<TRecord extends object>
  implements RecordRepositoryService<TRecord>
{
  
  private _maxResults = 60;

  constructor(private _records: Array<TRecord>) {}

  getAll(continuationToken?: string): Observable<GetManyResult<TRecord>> {
    console.log("Mock repository get all");

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
      continuationToken: nextContinuationToken,
      records,
    });
  }

  search(
    query: string,
    continuationToken?: string
  ): Observable<GetManyResult<TRecord>> {
    console.log("Mock repository search");
    return this.getAll(continuationToken).pipe(
      map((result) => ({
        records: result.records.filter((record) => {
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
        continuationToken: result.continuationToken,
      }))
    );
  }

  // Search
  // Add
  // Update
  // Delete
}

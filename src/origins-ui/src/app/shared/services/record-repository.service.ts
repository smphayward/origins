import { ArrayDataSource } from '@angular/cdk/collections';
import { map, Observable, of } from 'rxjs';
import { OriginsRecord } from '../models/record';
import { DeleteResult, GetManyResult } from '../models/repository-results';

export interface RecordRepositoryService<TRecord extends OriginsRecord> {
  
  getAll: (continuationToken?: string) => Observable<GetManyResult<TRecord>>;

  search: (
    query: string,
    continuationToken?: string
  ) => Observable<GetManyResult<TRecord>>;

  // Search
  // Add
  // Update
  
  deleteById: (id: string) => Observable<DeleteResult>;
}

import { ArrayDataSource } from '@angular/cdk/collections';
import { map, Observable, of } from 'rxjs';
import { GetManyResult } from '../models/repository-results';

export interface RecordRepositoryService<TRecord extends object> {
  
  getAll: (continuationToken?: string) => Observable<GetManyResult<TRecord>>;

  search: (
    query: string,
    continuationToken?: string
  ) => Observable<GetManyResult<TRecord>>;

  // Search
  // Add
  // Update
  // Delete
}

// import { ArrayDataSource } from '@angular/cdk/collections';
// import { map, Observable, of } from 'rxjs';
// import { OriginsRecord } from '../../_boneyard/shared/models/record';
// import { AddResult, DeleteResult, GetManyResult, UpdateResult } from '../../_boneyard/shared/models/repository-results';

// export interface RecordRepositoryService<
//   TRecordForRead extends OriginsRecord,
//   TRecordForWrite extends OriginsRecord
// > {

//   getAll: (
//     continuationToken?: string
//   ) => Observable<GetManyResult<TRecordForRead>>;

//   search: (
//     query: string,
//     continuationToken?: string
//   ) => Observable<GetManyResult<TRecordForRead>>;

//   add: (record: TRecordForWrite) => Observable<AddResult<TRecordForRead>>;

//   update: (record: TRecordForWrite) => Observable<UpdateResult<TRecordForRead>>;

//   deleteById: (id: string) => Observable<DeleteResult>;

// }

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, iif } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { GetManyResult } from 'src/app/shared/models/repository-results';
import { RecordEffects } from 'src/app/shared/store/RecordEffects';
import { CollectionInfo } from '../collections.models';
import { CollectionRepositoryService } from '../services/collection-repository.service';
import { collectionActions } from './collections.actions';

@Injectable()
export class CollectionsEffects extends RecordEffects<CollectionInfo> {

  constructor(
    actions$: Actions,
    repository: CollectionRepositoryService
  ) {
    super(actions$, repository, collectionActions);
  }

}

// @Injectable()
// export class CollectionsEffects {
//   private lastSearchByTextQuery: string | undefined = undefined;
//   private lastContinuationToken: string | undefined = undefined;

//   constructor(
//     private actions$: Actions,
//     private repository: CollectionRepositoryService
//   ) {}

//   // ----- EFFECTS ----- //

//   getAll$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(collectionActions.getAll),
//       mergeMap(() =>
//         this.repository.getAll().pipe(
//           tap((result) => {
//             this.lastSearchByTextQuery = undefined;
//             this.lastContinuationToken = result.continuationToken;
//           }),
//           map((result) => this.mapGetManyResultToAction(result)),
//           catchError(() => EMPTY)
//         )
//       )
//     )
//   );

//   searchByText$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(collectionActions.searchByText),
//       mergeMap((action) =>
//         this.repository.search(action.query).pipe(
//           tap((result) => {
//             this.lastSearchByTextQuery = action.query;
//             this.lastContinuationToken = result.continuationToken;
//           }),
//           map((result) => this.mapGetManyResultToAction(result)),
//           catchError(() => EMPTY)
//         )
//       )
//     )
//   );

//   fetchNextResult$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(collectionActions.fetchMoreRecords),
//       mergeMap((action) =>
//         iif(
//           () => this.lastSearchByTextQuery === undefined,
//           this.repository.getAll(this.lastContinuationToken),
//           this.repository.search(
//             this.lastSearchByTextQuery ?? '',
//             this.lastContinuationToken
//           )
//         ).pipe(
//           tap((result) => {
//             this.lastContinuationToken = result.continuationToken;
//           }),
//           map((result) => this.mapGetManyResultToAction(result)),
//           catchError(() => EMPTY)
//         )
//       )
//     )
//   );

//   // ----- HELPER FUNCTIONS ----- //
//   private mapGetManyResultToAction = (
//     result: GetManyResult<CollectionInfo>
//   ) => {
//     return collectionActions.recordsLoaded({
//       records: result.records,
//       isContinuation: true,
//       moreRecordsAvailable: result.continuationToken !== undefined,
//     });
//   };
// }

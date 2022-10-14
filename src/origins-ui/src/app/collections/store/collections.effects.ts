import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { DocumentEffects } from 'src/app/shared/store/document.effects';
import { Collection, CollectionInfo } from 'origins-common/collections';
import { CollectionInfoProvider } from '../services/collection-info-provider.service';
import { collectionActions } from './collections.actions';

@Injectable()
export class CollectionsEffects extends DocumentEffects<
  CollectionInfo,
  Collection
> {
  constructor(actions$: Actions, repository: CollectionInfoProvider) {
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

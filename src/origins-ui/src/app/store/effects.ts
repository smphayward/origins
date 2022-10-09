import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, iif } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { RepositoryService } from '../services/repository.service';
import { getAll, resultLoaded, searchByText, fetchMoreResults } from './actions';



@Injectable()
export class SearchEffects {
  private lastSearchByTextQuery: string | undefined = undefined;
  private lastContinuationToken: string | undefined = undefined;

  getAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getAll),
      mergeMap(() =>
        this.repositoryService.getAll().pipe(
          tap((result) => {
            this.lastSearchByTextQuery = undefined;
            this.lastContinuationToken = result.continuationToken;
          }),
          map((result) =>
            resultLoaded({
              results: result.documents,
              isContinuation: false,
              moreResultsAvailable: result.continuationToken !== undefined,
            })
          ),
          catchError(() => EMPTY)
        )
      )
    )
  );

  searchByText$ = createEffect(() =>
    this.actions$.pipe(
      ofType(searchByText),
      mergeMap((action) =>
        this.repositoryService.search(action.query).pipe(
          tap((result) => {
            this.lastSearchByTextQuery = action.query;
            this.lastContinuationToken = result.continuationToken;
          }),
          map((result) =>
            resultLoaded({
              results: result.documents,
              isContinuation: false,
              moreResultsAvailable: result.continuationToken !== undefined,
            })
          ),
          catchError(() => EMPTY)
        )
      )
    )
  );

  fetchNextResult$ = createEffect(() =>
  this.actions$.pipe(
    ofType(fetchMoreResults),
    
    mergeMap((action) => 
    iif(() => this.lastSearchByTextQuery === undefined,
      this.repositoryService.getAll(this.lastContinuationToken),
      this.repositoryService.search(this.lastSearchByTextQuery ?? '', this.lastContinuationToken))
      .pipe(
        tap((result) => {
          this.lastContinuationToken = result.continuationToken;
        }),
        map((result) =>
          resultLoaded({
            results: result.documents,
            isContinuation: true,
            moreResultsAvailable: result.continuationToken !== undefined,
          })
        ),
        catchError(() => EMPTY)
      )
    )
  )
);

  // fetchNextResult$ = createEffect(() => this.actions$.pipe(
  //   ofType(fetchNextResult),
  //   mergeMap((action) => this.searchService.)
  // ))

  constructor(
    private actions$: Actions,
    private repositoryService: RepositoryService
  ) {}
}

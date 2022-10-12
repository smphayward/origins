import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, iif } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { GetManyResult } from 'src/app/shared/models/repository-results';
import { OriginsRecord } from '../models/record';
import { RecordRepositoryService } from '../services/record-repository.service';
import { RecordActions } from './RecordActions';

export abstract class RecordEffects<
  TRecordForRead extends OriginsRecord,
  TRecordForWrite extends OriginsRecord
> {
  private lastSearchByTextQuery: string | undefined = undefined;
  private lastContinuationToken: string | undefined = undefined;

  constructor(
    private actions$: Actions,
    private repository: RecordRepositoryService<
      TRecordForRead,
      TRecordForWrite
    >,
    private recordActions: RecordActions<TRecordForRead, TRecordForWrite>
  ) {}

  // ----- READ OPERATIONS ----- //

  getAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.recordActions.getAll), // ofType(getAllCollections),
      mergeMap(() =>
        this.repository.getAll().pipe(
          tap((result) => {
            this.lastSearchByTextQuery = undefined;
            this.lastContinuationToken = result.continuationToken;
          }),
          map((result) => this.mapGetManyResultToAction(result, false)),
          catchError(() => EMPTY)
        )
      )
    )
  );

  searchByText$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.recordActions.searchByText),
      mergeMap((action) =>
        this.repository.search(action.query).pipe(
          tap((result) => {
            this.lastSearchByTextQuery = action.query;
            this.lastContinuationToken = result.continuationToken;
          }),
          map((result) => this.mapGetManyResultToAction(result, false)),
          catchError(() => EMPTY)
        )
      )
    )
  );

  fetchNextResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.recordActions.fetchMoreRecords),
      mergeMap((action) =>
        iif(
          () => this.lastSearchByTextQuery === undefined,
          this.repository.getAll(this.lastContinuationToken),
          this.repository.search(
            this.lastSearchByTextQuery ?? '',
            this.lastContinuationToken
          )
        ).pipe(
          tap((result) => {
            this.lastContinuationToken = result.continuationToken;
          }),
          map((result) => this.mapGetManyResultToAction(result, true)),
          catchError(() => EMPTY)
        )
      )
    )
  );

  // ----- WRITE OPERATIONS ----- //
  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.recordActions.requestAddRecord),
      mergeMap((action) =>
        this.repository.add(action.record).pipe(
          map((result) => {
            console.log('Result', result);
            if (result.success && result.record)
              return this.recordActions.addRecordSucceeded({
                record: result.record,
              });
            else {
              return this.recordActions.addRecordFailed({
                reason: result.message,
              });
            }
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.recordActions.requestUpdateRecord),
      mergeMap((action) =>
        this.repository.update(action.record).pipe(
          map((result) => {
            console.log('Result', result);
            if (result.success && result.record)
              return this.recordActions.updateRecordSucceeded({
                record: result.record,
              });
            else {
              return this.recordActions.updateRecordFailed({
                reason: result.message,
              });
            }
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  deleteById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.recordActions.requestDeleteRecordById),
      mergeMap((action) =>
        this.repository.deleteById(action.id).pipe(
          map((result) => {
            console.log('Result', result);
            if (result.success)
              return this.recordActions.deleteRecordSucceeded({
                id: action.id,
              });
            else {
              return this.recordActions.deleteRecordFailed({
                id: action.id,
                reason: result.message,
              });
            }
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  // ----- HELPER FUNCTIONS ----- //

  private mapGetManyResultToAction = (
    result: GetManyResult<TRecordForRead>,
    isContinuation: boolean
  ) => {
    return this.recordActions.recordsLoaded({
      records: result.records,
      isContinuation,
      moreRecordsAvailable: result.continuationToken !== undefined,
    });
  };
}

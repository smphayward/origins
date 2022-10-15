import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OriginsDocument, ObservableDocumentProvider, GetDocumentsResponse } from 'origins-common';
import { EMPTY, iif } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { DocumentActions } from './document.actions';

export abstract class DocumentEffects<
  TDocumentForRead extends OriginsDocument,
  TDocumentForWrite extends OriginsDocument
> {
  private lastSearchByTextQuery: string | undefined = undefined;
  private lastContinuationToken: string | undefined = undefined;

  private readonly maxDocuments = 60;

  constructor(
    private actions$: Actions,
    private repository: ObservableDocumentProvider<
      TDocumentForRead,
      TDocumentForWrite
    >,
    private documentActions: DocumentActions<
      TDocumentForRead,
      TDocumentForWrite
    >
  ) {}

  // ██████  ███████  █████  ██████
  // ██   ██ ██      ██   ██ ██   ██
  // ██████  █████   ███████ ██   ██
  // ██   ██ ██      ██   ██ ██   ██
  // ██   ██ ███████ ██   ██ ██████

  getAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.documentActions.getAll), // ofType(getAllCollections),
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
      ofType(this.documentActions.searchByText),
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
      ofType(this.documentActions.fetchMoreDocuments),
      mergeMap((action) =>
        iif(
          () => this.lastSearchByTextQuery === undefined,
          this.repository.getAll(this.maxDocuments, this.lastContinuationToken),
          this.repository.search(
            this.lastSearchByTextQuery ?? '',
            this.maxDocuments,
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

  // ██     ██ ██████  ██ ████████ ███████
  // ██     ██ ██   ██ ██    ██    ██
  // ██  █  ██ ██████  ██    ██    █████
  // ██ ███ ██ ██   ██ ██    ██    ██
  //  ███ ███  ██   ██ ██    ██    ███████

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.documentActions.requestAddDocument),
      mergeMap((action) =>
        this.repository.put(action.document).pipe(
          map((result) => {
            console.log('Result', result);
            if (result.success && result.document)
              return this.documentActions.addDocumentSucceeded({
                document: result.document,
              });
            else {
              return this.documentActions.addDocumentFailed({
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
      ofType(this.documentActions.requestUpdateDocument),
      mergeMap((action) =>
        this.repository.put(action.document).pipe(
          map((result) => {
            console.log('Result', result);
            if (result.success && result.document)
              return this.documentActions.updateDocumentSucceeded({
                document: result.document,
              });
            else {
              return this.documentActions.updateDocumentFailed({
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
      ofType(this.documentActions.requestDeleteDocumentById),
      mergeMap((action) =>
        this.repository.delete(action.id).pipe(
          map((result) => {
            console.log('Result', result);
            if (result.success)
              return this.documentActions.deleteDocumentSucceeded({
                id: action.id,
              });
            else {
              return this.documentActions.deleteDocumentFailed({
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

  // ██████  ██    ██ ██████   ██████  ███████
  // ██   ██ ██    ██ ██   ██ ██       ██
  // ██████  ██    ██ ██████  ██   ███ █████
  // ██      ██    ██ ██   ██ ██    ██ ██
  // ██       ██████  ██   ██  ██████  ███████

  purge$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.documentActions.requestPurgeDocuments),
      mergeMap((action) =>
        this.repository.purge(action.lucene).pipe(
          map((result) => {
            console.log('Result', result);
            if (result.success)
              return this.documentActions.purgeDocumentsSucceeded({
                documentsDeleted: result.documentsDeleted,
              });
            else {
              return this.documentActions.purgeDocumentsFailed();
            }
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  // ██████  ██████   ██████   ██████ ███████ ███████ ███████
  // ██   ██ ██   ██ ██    ██ ██      ██      ██      ██
  // ██████  ██████  ██    ██ ██      █████   ███████ ███████
  // ██      ██   ██ ██    ██ ██      ██           ██      ██
  // ██      ██   ██  ██████   ██████ ███████ ███████ ███████

  // process$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(this.documentActions.requestProcess),
  //     mergeMap((action) =>
  //       this.repository.process().pipe(
  //         map((result) => {
  //           console.log('Result', result);
  //           if (result.success) return this.documentActions.processSucceeded();
  //           else {
  //             return this.documentActions.processFailed();
  //           }
  //         }),
  //         catchError(() => EMPTY)
  //       )
  //     )
  //   )
  // );



  // ██   ██ ███████ ██      ██████  ███████ ██████
  // ██   ██ ██      ██      ██   ██ ██      ██   ██
  // ███████ █████   ██      ██████  █████   ██████
  // ██   ██ ██      ██      ██      ██      ██   ██
  // ██   ██ ███████ ███████ ██      ███████ ██   ██

  private mapGetManyResultToAction = (
    result: GetDocumentsResponse<TDocumentForRead>,
    isContinuation: boolean
  ) => {
    if (result.success && result.documents) {
      return this.documentActions.fetchDocumentsSucceeded({
        documents: result.documents,
        isContinuation,
        moreDocumentsAvailable: result.continuationToken !== undefined,
      });
    }
    return this.documentActions.fetchDocumentsFailed({
      reason: result.message,
    });
  };
}

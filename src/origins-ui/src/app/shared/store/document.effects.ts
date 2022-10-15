import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { resultMemoize } from '@ngrx/store';
import { OriginsDocument, ObservableDocumentProvider, GetDocumentsResponse } from 'origins-common';
import { EMPTY, iif, of } from 'rxjs';
import { map, mergeMap, catchError, tap, switchMap } from 'rxjs/operators';
import { changeNotificationMessage } from 'src/app/status/store/status.actions';
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
    >,
    private documentTypeName: string
  ) {}

  // ██████  ███████  █████  ██████
  // ██   ██ ██      ██   ██ ██   ██
  // ██████  █████   ███████ ██   ██
  // ██   ██ ██      ██   ██ ██   ██
  // ██   ██ ███████ ██   ██ ██████

  getAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.documentActions.getAll), // ofType(getAllCollections),
      switchMap(() =>
        this.repository.getAll().pipe(
          tap((result) => {
            this.lastSearchByTextQuery = undefined;
            this.lastContinuationToken = result.continuationToken;
          }),
          switchMap((result) => this.mapGetManyResultToAction(result, false)),
          catchError(() => EMPTY)
        )
      )
    )
  );

  searchByText$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.documentActions.searchByText),
      switchMap((action) =>
        this.repository.search(action.query).pipe(
          tap((result) => {
            this.lastSearchByTextQuery = action.query;
            this.lastContinuationToken = result.continuationToken;
          }),
          switchMap((result) => this.mapGetManyResultToAction(result, false)),
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
          switchMap((result) => this.mapGetManyResultToAction(result, true)),
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
      switchMap((action) =>
        this.repository.put(action.document).pipe(
          switchMap((result) => {
            console.log('Result', result);
            if (result.success && result.document)
              return of(
                this.documentActions.addDocumentSucceeded({
                  document: result.document,
                }),
                changeNotificationMessage({
                  message: `Add ${this.documentTypeName} succeeded.`,
                })
              );
            else {
              return of(
                this.documentActions.addDocumentFailed({
                  reason: result.message,
                }),
                changeNotificationMessage({
                  message: `Delete ${this.documentTypeName} failed. ${result.statusCode} -- ${result.message}`,
                })
              );
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
      switchMap((action) =>
        this.repository.put(action.document).pipe(
          switchMap((result) => {
            console.log('Result', result);
            if (result.success && result.document)
              return of(
                this.documentActions.updateDocumentSucceeded({
                  document: result.document,
                }),
                changeNotificationMessage({
                  message: `Update ${this.documentTypeName} succeeded.`,
                })
              );
            else {
              return of(
                this.documentActions.updateDocumentFailed({
                  reason: result.message,
                }),
                changeNotificationMessage({
                  message: `Delete ${this.documentTypeName} failed. ${result.statusCode} -- ${result.message}`,
                })
              );
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
      switchMap((action) =>
        this.repository.delete(action.id).pipe(
          switchMap((result) => {
            console.log('Result', result);
            if (result.success)
              return of(
                this.documentActions.deleteDocumentSucceeded({
                  id: action.id,
                }),
                changeNotificationMessage({
                  message: `Delete ${this.documentTypeName} succeeded.`,
                })
              );
            else {
              return of(
                this.documentActions.deleteDocumentFailed({
                  id: action.id,
                  reason: result.message,
                }),
                changeNotificationMessage({
                  message: `Delete ${this.documentTypeName} failed. ${result.statusCode} -- ${result.message}`,
                })
              );
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
      switchMap((action) =>
        this.repository.purge(action.lucene).pipe(
          switchMap((result) => {
            console.log('Result', result);
            if (result.success)
              return of(
                this.documentActions.purgeDocumentsSucceeded({
                  documentsDeleted: result.documentsDeleted,
                }),
                changeNotificationMessage({
                  message: `Purge removed ${result.documentsDeleted} ${this.documentTypeName}s.`,
                })
              );
            else {
              return of(
                this.documentActions.purgeDocumentsFailed(),
                changeNotificationMessage({
                  message: `Purge failed. ${result.statusCode} - ${result.message}`,
                })
              );
            }
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  // purge_old$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(this.documentActions.requestPurgeDocuments),
  //     mergeMap((action) =>
  //       this.repository.purge(action.lucene).pipe(
  //         map((result) => {
  //           console.log('Result', result);
  //           if (result.success)
  //             return this.documentActions.purgeDocumentsSucceeded({
  //               documentsDeleted: result.documentsDeleted,
  //             });
  //           else {
  //             return this.documentActions.purgeDocumentsFailed();
  //           }
  //         }),
  //         catchError(() => EMPTY)
  //       )
  //     )
  //   )
  // );

  // ██████  ██████   ██████   ██████ ███████ ███████ ███████
  // ██   ██ ██   ██ ██    ██ ██      ██      ██      ██
  // ██████  ██████  ██    ██ ██      █████   ███████ ███████
  // ██      ██   ██ ██    ██ ██      ██           ██      ██
  // ██      ██   ██  ██████   ██████ ███████ ███████ ███████

  process$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.documentActions.requestProcessDocument),
      switchMap((action) =>
        this.repository.process(action.id).pipe(
          switchMap((result) => {
            console.log('Result', result);
            if (result.success) {
              return of(
                this.documentActions.processDocumentSucceeded({
                  id: action.id,
                }),
                changeNotificationMessage({
                  message: `Process ${this.documentTypeName} succeeded.`,
                })
              );
            } else {
              return of(
                this.documentActions.processDocumentFailed({ id: action.id }),
                changeNotificationMessage({
                  message: `Process ${this.documentTypeName} failed. ${result.statusCode} - ${result.message}`,
                })
              );
            }
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

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
      return of(
        this.documentActions.fetchDocumentsSucceeded({
          documents: result.documents,
          isContinuation,
          moreDocumentsAvailable: result.continuationToken !== undefined,
        }),
        changeNotificationMessage({
          message: `Read ${result.documents.length} ${this.documentTypeName}s.${
            result.continuationToken ? ' (More available)' : ''
          }`,
        })
      );
    }
    return of(
      this.documentActions.fetchDocumentsFailed({
        reason: result.message,
      }),
      changeNotificationMessage({
        message: `Failed to get ${this.documentTypeName}s. ${result.statusCode} - ${result.message}`,
      })
    );
  };
}

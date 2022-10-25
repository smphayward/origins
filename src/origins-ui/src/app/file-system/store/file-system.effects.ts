import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, map, of, switchMap, tap } from 'rxjs';
import { FileSystemProvider } from '../services/file-system-provider.service';
import {
  requestLoadAllObjects,
  objectsLoaded
} from './file-system.actions';

@Injectable()
export class FileSystemEffects {
  // private lastSearchByTextQuery: string | undefined = undefined;
  // private lastContinuationToken: string | undefined = undefined;

  // private readonly maxDocuments = 60;

  constructor(
    private actions$: Actions,
    private repository: FileSystemProvider
  ) {}

  // ██████  ███████  █████  ██████
  // ██   ██ ██      ██   ██ ██   ██
  // ██████  █████   ███████ ██   ██
  // ██   ██ ██      ██   ██ ██   ██
  // ██   ██ ███████ ██   ██ ██████

  // Load everything

  requestLoadAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(requestLoadAllObjects),
      switchMap((action) =>
        this.repository.getAll().pipe(
          //tap(response => console.log("getAll Response", response)),
          switchMap((response) =>
            of(
              objectsLoaded({
                objects: response,
                // TODO: Figure out how to make this true
                removeAllExistingObjects: false,
              })
            )
          )
        )
      )
    )
  );

  // loadRootDirectories$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(requestLoadRootDirectories),
  //     switchMap((action) =>
  //       this.repository.getAll().pipe(
  //         // tap((result) => {
  //         //   this.lastSearchByTextQuery = undefined;
  //         //   this.lastContinuationToken = result.continuationToken;
  //         // }),
  //         switchMap((result) => {
  //           if (result.success) {
  //             if (result.directories) {
  //               return of(
  //                 directoriesLoaded({
  //                   directories: result.directories,
  //                   removeAllExistingDirectories: true
  //                 }),
  //                 ...result.directories.map((d) =>
  //                   requestLoadDirectoryChildren({
  //                     collectionId: d.collectionId,
  //                     directoryId: d.id,
  //                   })
  //                 )
  //               );
  //             } else {
  //               return of(
  //                 loadRootDirectoriesFailed({ reason: 'No directories found.' })
  //               );
  //             }
  //           } else {
  //             return of(loadRootDirectoriesFailed({ reason: result.message }));
  //           }
  //         }),
  //         catchError(() => EMPTY)
  //       )
  //     )
  //   )
  // );

  // populateChildren$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(requestLoadDirectoryChildren),
  //     switchMap((action) =>
  //       this.repository
  //         .getChildDirectoriesAndFiles(action.collectionId, action.directoryId)
  //         .pipe(
  //           // tap((result) => {
  //           //   this.lastSearchByTextQuery = undefined;
  //           //   this.lastContinuationToken = result.continuationToken;
  //           // }),
  //           switchMap((result) => {
  //             if (result.success) {
  //               return of(
  //                 directoriesLoaded({
  //                   directories: result.directories,
  //                   removeAllExistingDirectories: false
  //                 }),
  //                 filesLoaded({
  //                   files: result.files,
  //                   removeAllExistingFiles: false
  //                 })
  //               );
  //             } else {
  //               return of(
  //                 loadDirectoryChildrenFailed({
  //                   reason: result.message,
  //                 })
  //               );
  //             }
  //           }),
  //           catchError(() => EMPTY)
  //         )
  //     )
  //   )
  // );
}

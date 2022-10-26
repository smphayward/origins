import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, map, of, switchMap, tap } from 'rxjs';
import { changeNotificationMessage } from 'src/app/status/store/status.actions';
import { FileSystemProvider } from '../services/file-system-provider.service';
import {
  requestLoadAllObjects,
  objectsLoaded,
  requestDeleteFileSystemObject,
  deleteFileSystemObjectSucceeded,
  deleteFileSystemObjectFailed,
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

  requestDelete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(requestDeleteFileSystemObject),
      switchMap((action) =>
        this.repository.delete(action.fullPath).pipe(
          switchMap((response) => {
            if (response.success) {
              return of(
                deleteFileSystemObjectSucceeded({ fullPath: action.fullPath }),
                changeNotificationMessage({
                  message: `Successfully deleted '${action.fullPath}'.`,
                }),
                // TODO: Need to update some things in the store....
              );
            }
            return of(
              deleteFileSystemObjectFailed({fullPath: action.fullPath, reason: response.message }),
              changeNotificationMessage({
                message: `Failed to delete '${action.fullPath}'. ${response.message}`,
              })
            );
          })
        )
      )
    )
  );
}

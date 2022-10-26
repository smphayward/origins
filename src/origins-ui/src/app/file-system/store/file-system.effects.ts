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

}

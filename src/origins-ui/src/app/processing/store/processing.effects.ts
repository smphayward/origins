import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, map, of, switchMap, tap } from 'rxjs';
import { changeNotificationMessage } from 'src/app/status/store/status.actions';
import { ProcessingProvider } from '../services/processing-provider.service';
import { processingSucceeded, requestFileSystemObjectProcessing } from './processing.actions';

@Injectable()
export class ProcessingEffects {
  // private lastSearchByTextQuery: string | undefined = undefined;
  // private lastContinuationToken: string | undefined = undefined;

  // private readonly maxDocuments = 60;

  constructor(
    private actions$: Actions,
    private provider: ProcessingProvider
  ) {}

  // ██████  ███████  █████  ██████
  // ██   ██ ██      ██   ██ ██   ██
  // ██████  █████   ███████ ██   ██
  // ██   ██ ██      ██   ██ ██   ██
  // ██   ██ ███████ ██   ██ ██████

  // Load everything

  requestLoadAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(requestFileSystemObjectProcessing),
      switchMap((action) =>
        this.provider
          .processFileSystemObject(action.fullPath, action.depth)
          .pipe(
            //tap(response => console.log("getAll Response", response)),
            switchMap((response) =>
              of(
                processingSucceeded(),
                changeNotificationMessage({
                  message: `Successfully processed '${action.fullPath}'.`,
                })
              )
            )
          )
      )
    )
  );
}

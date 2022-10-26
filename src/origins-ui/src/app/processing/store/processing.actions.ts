import { createAction, props } from "@ngrx/store";


export const requestFileSystemObjectProcessing = createAction(
  `[Processing] Request File System Object Processing`,
  props<{fullPath: string, depth?: number }>()
);

export const processingSucceeded = createAction(
  `[Processing] Processing Succeeded`,
);

export const processingFailed = createAction(
  `[Processing] Processing Failed`,
  props<{reason: string}>()
);

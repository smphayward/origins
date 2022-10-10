// import { createAction, props } from '@ngrx/store';
// import { IndexRecord, MultipleDocumentsResult } from './models';

// export const changeOptions = createAction(
//   '[Options] Change Options',
//   props<{ useLargeImages: boolean }>()
// );

// // ----- Data ----- //
// export const getAll = createAction(
//   '[Search] Get All'
// );
// export const searchByText = createAction(
//   '[Search] Search by Text',
//   props<{ query: string }>()
// );
// export const fetchMoreResults = createAction('[Search] Fetch More Results');

// export const resultLoaded = createAction(
//   '[Search] Result Loaded',
//   props<{
//     results: Array<IndexRecord>;
//     isContinuation: boolean;
//     moreResultsAvailable: boolean;
//   }>()
// );

// // ----- UI - Lightbox ----- //
// export const showLightboxItem = createAction(
//   '[UI Lightbox] Show Lightbox Item',
//   props<{ index: number }>()
// );

// export const clearLightboxItem = createAction(
//   '[UI Lightbox] Clear Lightbox Item',
// )

// export const showNextLightboxItem = createAction(
//   '[UI Lightbox] Show Next'
// )

// export const showPreviousLightboxItem = createAction(
//   '[UI Lightbox] Show Previous'
// )
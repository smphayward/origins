import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './reducer';


export const selectOrigins = createFeatureSelector<AppState>('originsReducer');

export const selectAppState = (state: AppState) => state;


export const selectMoreResultsAvailable = createSelector(
  selectOrigins,
  (state: AppState) => { console.log("selectMoreResultsAvailable"); return state.moreResultsAvailable; }
)
export const selectResults = createSelector(
  selectOrigins,
  (state: AppState) => { console.log("selectResults"); return state.results;}
)

export const selectOptions = createSelector(selectOrigins, (state) => state.options);

export const selectUseLargeImages = createSelector(
  selectOptions,
  (state) => state.useLargeImages
);


// ----- UI ----- //
export const selectUI = createSelector(selectOrigins, (state) => state.ui);

// ----- UI Lightbox ----- //
export const selectLightbox = createSelector(selectUI, (state) => state.lightbox);

export const selectLightboxIndex = createSelector(
  selectLightbox,
  (state) =>  state.index
);

export const selectLightboxItem = createSelector(
  selectLightbox,
  (state) => state.item
);



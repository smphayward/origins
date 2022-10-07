import { MatOptionSelectionChange } from '@angular/material/core';
import { createReducer, on, StateObservable } from '@ngrx/store';
import { emptyObjectsAreNotAllowedInProps } from '@ngrx/store/src/models';
import { mockData } from '../services/search.service';

import { changeOptions, clearLightboxItem, getAll, resultLoaded, showLightboxItem, showNextLightboxItem, showPreviousLightboxItem } from './actions';
import { IndexRecord, Options } from './models';

export interface AppState {
  options: Options;
  ui: {
    lightbox: {
      item?: IndexRecord;
      index?: number;
    }
  }
  
  results: Array<IndexRecord>;
  moreResultsAvailable: boolean;
  

  selectedSearchResultIndex?: number;
  
  
  


}

export const initialState: AppState = {
  options: {
    useLargeImages: false
  },
  ui: {
    lightbox: {
      item:  undefined,
      index: undefined,
    }
  },
  results: [],
  moreResultsAvailable: false
};

console.log(initialState);

export const originsReducer = createReducer(
  initialState,

  // ----- SEARCH ----- //
  on(
    resultLoaded,
    (state, { results, isContinuation, moreResultsAvailable }) => {
      
      let newState: AppState;
      if (isContinuation) {
        // Append the documents
        newState = {
          ...state,
          moreResultsAvailable,
          results: [...state.results, ...results],
        };
      } else {
        // Replace the documents
        newState = { ...state, results, moreResultsAvailable };
      }
      return newState;
    }
  ),

  // ----- UI - LIGHTBOX ----- //
  on(showLightboxItem, (state, { index }) => {
    return getStateWithLightboxIndexChange(state, index);
  }),

  on(clearLightboxItem, (state) => {
    return getStateWithLightboxIndexChange(state, undefined);
  }),

  on(showPreviousLightboxItem, (state) => {
    const currentIndex = state.ui.lightbox.index;
    if(currentIndex !== undefined){
      return getStateWithLightboxIndexChange(state, currentIndex - 1);  
    }
    return getStateWithLightboxIndexChange(state, undefined);
  }),

  on(showNextLightboxItem, (state) => {
    const currentIndex = state.ui.lightbox.index;
    if(currentIndex !== undefined){
      return getStateWithLightboxIndexChange(state, currentIndex + 1);  
    }
    return getStateWithLightboxIndexChange(state, undefined);
  }),

  // ----- OPTIONS ----- //
  on(changeOptions, (state, { useLargeImages }) => {
    let temp: AppState = { ...state, options: { ...state.options } };
    if (useLargeImages) {
      temp.options.useLargeImages = useLargeImages;
    }
    return temp;
  })
);

const getStateWithLightboxIndexChange = (state: AppState, index: number | undefined): AppState => {

  let item: IndexRecord | undefined;
  if(index === undefined || state.results.length === 0) {
    item = undefined;
    index = undefined;
  }
  else if(index< 0){
    index = 0;
    item = state.results[index];
  }
  else if(index >= state.results.length){
    index = state.results.length -1;
    item = state.results[index];
  }
  else {
    item = state.results[index];
  }
  return {
    ...state,
    ui: {
      ...state.ui,
      lightbox: {
        ... state.ui.lightbox,
        index,
        item
        
      }
    }
  };

}
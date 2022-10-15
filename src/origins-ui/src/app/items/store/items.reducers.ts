import { createReducer, on } from '@ngrx/store';
import { ItemInfo } from 'origins-common/items';
import { DocumentState } from 'src/app/shared/store/document.models';
import * as ReducerFunctions from 'src/app/shared/store/document.reducer-functions';
import * as ItemActions from './items.actions';

export interface ItemsState extends DocumentState<ItemInfo> {}

export const initialState: ItemsState = {
  documents: [],
  moreDocumentsAvailable: false,
  selectedDocumentIndex: undefined,
  selectedDocument: undefined
};

export const itemsReducer = createReducer(
  initialState,

  // ----- LOAD RECORDS ----- //
  on(ItemActions.fetchItemsSucceeded, ReducerFunctions.documentsLoaded),

  // ----- SELECTED ----- //
  on(ItemActions.clearSelectedItem, ReducerFunctions.clearSelectedDocument),
  on(ItemActions.moveToItem, ReducerFunctions.moveToDocument),
  on(ItemActions.moveToPreviousItem, ReducerFunctions.moveToPreviousDocument),
  on(ItemActions.moveToNextItem, ReducerFunctions.moveToNextDocument),

  // ----- PURGE ----- //
  on(ItemActions.purgeItemsSucceeded, ReducerFunctions.successfullyPurgedDocuments),

);
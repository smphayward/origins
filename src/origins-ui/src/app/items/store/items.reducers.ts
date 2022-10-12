import { createReducer, on } from '@ngrx/store';
import { RecordState } from 'src/app/shared/store/models';
import * as ReducerFunctions from 'src/app/shared/store/reducer-functions';
import { ItemInfo } from '../items.models';
import * as ItemActions from './items.actions';

export interface ItemsState extends RecordState<ItemInfo> {}

export const initialState: ItemsState = {
  records: [],
  moreRecordsAvailable: false,
  selectedRecordIndex: undefined,
  selectedRecord: undefined
};

export const itemsReducer = createReducer(
  initialState,

  // ----- LOAD RECORDS ----- //
  on(ItemActions.fetchItemsSucceeded, ReducerFunctions.recordsLoaded),

  // ----- SELECTED ----- //
  on(ItemActions.clearSelectedItem, ReducerFunctions.clearSelectedRecord),
  on(ItemActions.moveToItem, ReducerFunctions.moveToRecord),
  on(ItemActions.moveToPreviousItem, ReducerFunctions.moveToPreviousRecord),
  on(ItemActions.moveToNextItem, ReducerFunctions.moveToNextRecord)

);
import { createReducer, on } from '@ngrx/store';
import { RecordState } from 'src/app/shared/store/models';
import * as ReducerFunctions from 'src/app/shared/store/reducer-functions';
import { CollectionInfo } from '../collections.models';
import { mockCollections } from '../services/collection-mock-data';
import * as CollectionActions from './collections.actions';

export interface CollectionsState extends RecordState<CollectionInfo> {}

export const initialState: CollectionsState = {
  records: [],
  moreRecordsAvailable: false,
  selectedRecordIndex: undefined,
  selectedRecord: undefined
};

export const collectionsReducer = createReducer(
  initialState,

  // ----- READ RECORDS ----- //
  on(CollectionActions.fetchCollectionsSucceeded, ReducerFunctions.recordsLoaded),

  // ----- WRITE RECORDS ----- //
  on(CollectionActions.addCollectionSucceeded, ReducerFunctions.recordSuccessfullyAdded),
  on(CollectionActions.deleteCollectionSucceeded, ReducerFunctions.recordSuccessfullyDeleted),
  

  // ----- SELECTED ----- //
  on(CollectionActions.clearSelectedCollection, ReducerFunctions.clearSelectedRecord),
  on(CollectionActions.moveToCollection, ReducerFunctions.moveToRecord),
  on(CollectionActions.moveToPreviousCollection, ReducerFunctions.moveToPreviousRecord),
  on(CollectionActions.moveToNextCollection, ReducerFunctions.moveToNextRecord)

);
import { createReducer, on } from '@ngrx/store';
import { CollectionInfo } from 'origins-common/collections';
import { DocumentState } from 'src/app/shared/store/document.models';
import * as ReducerFunctions from 'src/app/shared/store/document.reducer-functions';
import * as CollectionActions from './collections.actions';

export interface CollectionsState extends DocumentState<CollectionInfo> {}

export const initialState: CollectionsState = {
  documents: [],
  moreDocumentsAvailable: false,
  selectedDocumentIndex: undefined,
  selectedDocument: undefined
};

export const collectionsReducer = createReducer(
  initialState,

  // ----- READ DOCUMENTS ----- //
  on(CollectionActions.fetchCollectionsSucceeded, ReducerFunctions.documentsLoaded),

  // ----- WRITE DOCUMENTS ----- //
  on(CollectionActions.addCollectionSucceeded, ReducerFunctions.documentSuccessfullyAdded),
  on(CollectionActions.deleteCollectionSucceeded, ReducerFunctions.documentSuccessfullyDeleted),

  // ----- PURGE ----- //
  on(CollectionActions.purgeCollectionsSucceeded, ReducerFunctions.successfullyPurgedDocuments),

  // ----- SELECTED ----- //
  on(CollectionActions.clearSelectedCollection, ReducerFunctions.clearSelectedDocument),
  on(CollectionActions.moveToCollection, ReducerFunctions.moveToDocument),
  on(CollectionActions.moveToPreviousCollection, ReducerFunctions.moveToPreviousDocument),
  on(CollectionActions.moveToNextCollection, ReducerFunctions.moveToNextDocument)

);
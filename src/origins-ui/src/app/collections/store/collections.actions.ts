import { RecordActions } from "src/app/shared/store/RecordActions";
import { CollectionInfo } from "../collections.models";

export const collectionActions = new RecordActions<CollectionInfo>('Collections');

// READ
export const getAllCollections = collectionActions.getAll;
export const searchCollectionsByText = collectionActions.searchByText;
export const fetchMoreCollections = collectionActions.fetchMoreRecords;
export const collectionRecordsLoaded = collectionActions.recordsLoaded;

// WRITE
export const requestDeleteCollectionById = collectionActions.requestDeleteRecordById;
export const deleteCollectionSucceeded = collectionActions.deleteRecordSucceeded;

// Selected Record
export const clearSelectedCollection = collectionActions.clearSelectedRecord;
export const moveToCollection = collectionActions.moveToRecord;
export const moveToPreviousCollection = collectionActions.moveToPreviousRecord;
export const moveToNextCollection = collectionActions.moveToNextRecord;
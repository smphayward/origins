import { RecordActions } from "src/app/shared/store/RecordActions";
import { CollectionInfo, Collection } from "../collections.models";

export const collectionActions = new RecordActions<CollectionInfo, Collection>('Collections');

// READ
export const getAllCollections = collectionActions.getAll;
export const searchCollectionsByText = collectionActions.searchByText;
export const fetchMoreCollections = collectionActions.fetchMoreRecords;
export const fetchCollectionsSucceeded = collectionActions.fetchRecordsSucceeded;
export const fetchCollectionsFailed = collectionActions.fetchRecordsFailed;

// WRITE
export const requestAddCollection = collectionActions.requestAddRecord;
export const addCollectionSucceeded = collectionActions.addRecordSucceeded;
export const addCollectionFailed = collectionActions.addRecordFailed;

export const requestUpdateCollection = collectionActions.requestUpdateRecord;
export const updateCollectionSucceeded = collectionActions.updateRecordSucceeded;
export const updateCollectionFailed = collectionActions.updateRecordFailed;

export const requestDeleteCollectionById = collectionActions.requestDeleteRecordById;
export const deleteCollectionSucceeded = collectionActions.deleteRecordSucceeded;
export const deleteCollectionFailed = collectionActions.deleteRecordFailed;

// Selected Record
export const clearSelectedCollection = collectionActions.clearSelectedRecord;
export const moveToCollection = collectionActions.moveToRecord;
export const moveToPreviousCollection = collectionActions.moveToPreviousRecord;
export const moveToNextCollection = collectionActions.moveToNextRecord;
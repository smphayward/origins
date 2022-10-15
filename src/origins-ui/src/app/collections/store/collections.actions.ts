import { Collection, CollectionInfo } from "origins-common/collections";
import { DocumentActions } from "src/app/shared/store/document.actions";

export const collectionActions = new DocumentActions<CollectionInfo, Collection>('Collections');

// READ
export const getAllCollections = collectionActions.getAll;
export const searchCollectionsByText = collectionActions.searchByText;
export const fetchMoreCollections = collectionActions.fetchMoreDocuments;
export const fetchCollectionsSucceeded = collectionActions.fetchDocumentsSucceeded;
export const fetchCollectionsFailed = collectionActions.fetchDocumentsFailed;

// WRITE
export const requestAddCollection = collectionActions.requestAddDocument;
export const addCollectionSucceeded = collectionActions.addDocumentSucceeded;
export const addCollectionFailed = collectionActions.addDocumentFailed;

export const requestUpdateCollection = collectionActions.requestUpdateDocument;
export const updateCollectionSucceeded = collectionActions.updateDocumentSucceeded;
export const updateCollectionFailed = collectionActions.updateDocumentFailed;

export const requestDeleteCollectionById = collectionActions.requestDeleteDocumentById;
export const deleteCollectionSucceeded = collectionActions.deleteDocumentSucceeded;
export const deleteCollectionFailed = collectionActions.deleteDocumentFailed;

// Purge
export const requestPurgeCollections = collectionActions.requestPurgeDocuments;
export const purgeCollectionsSucceeded = collectionActions.purgeDocumentsSucceeded;
export const purgeCollectionsFailed = collectionActions.purgeDocumentsFailed;

// Selected Document
export const clearSelectedCollection = collectionActions.clearSelectedDocument;
export const moveToCollection = collectionActions.moveToDocument;
export const moveToPreviousCollection = collectionActions.moveToPreviousDocument;
export const moveToNextCollection = collectionActions.moveToNextDocument;
import { DocumentActions } from "src/app/shared/store/document.actions";
import { Item, ItemInfo } from 'origins-common/items';

export const itemActions = new DocumentActions<ItemInfo, Item>('Items');

// CRUD
export const getAllItems = itemActions.getAll;
export const searchItemsByText = itemActions.searchByText;
export const fetchMoreItems = itemActions.fetchMoreDocuments;
export const fetchItemsSucceeded = itemActions.fetchDocumentsSucceeded;
export const fetchItemsFailed = itemActions.fetchDocumentsFailed;

// Selected Document
export const clearSelectedItem = itemActions.clearSelectedDocument;
export const moveToItem = itemActions.moveToDocument;
export const moveToPreviousItem = itemActions.moveToPreviousDocument;
export const moveToNextItem = itemActions.moveToNextDocument;
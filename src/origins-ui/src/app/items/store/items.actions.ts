import { RecordActions } from "src/app/shared/store/RecordActions";
import { Item, ItemInfo } from "../items.models";

export const itemActions = new RecordActions<ItemInfo, Item>('Items');

// CRUD
export const getAllItems = itemActions.getAll;
export const searchItemsByText = itemActions.searchByText;
export const fetchMoreItemRecords = itemActions.fetchMoreRecords;
export const itemRecordsLoaded = itemActions.recordsLoaded;

// Selected Record
export const clearSelectedItem = itemActions.clearSelectedRecord;
export const moveToItem = itemActions.moveToRecord;
export const moveToPreviousItem = itemActions.moveToPreviousRecord;
export const moveToNextItem = itemActions.moveToNextRecord;

import { RecordSelectors } from 'src/app/shared/store/selector-factories';
import { ItemInfo } from '../items.models';
import { ItemsState } from './items.reducers';

const itemsSelectors = new RecordSelectors<ItemInfo, ItemsState>('items');

// ----- Feature/State ----- //
export const itemsFeatureSelector = itemsSelectors.featureSelector;
export const selectItemsState = itemsSelectors.selectState;

// ----- All Records ----- //
export const selectItems = itemsSelectors.selectRecords;
export const selectMoreItemsAvailable = itemsSelectors.selectMoreRecordsAvailable;

// ----- Selected Record ----- //
export const selectSelectedItem = itemsSelectors.selectSelectedRecord;
export const selectHasSelectedItem = itemsSelectors.selectHasSelectedRecord;
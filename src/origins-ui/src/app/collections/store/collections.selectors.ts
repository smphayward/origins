import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CollectionInfo } from 'origins-common/collections';
import { DocumentSelectors } from 'src/app/shared/store/document.selectors';

import { CollectionsState } from './collections.reducers';

const collectionsSelectors = new DocumentSelectors<CollectionInfo, CollectionsState>('collections');

// ----- Feature/State ----- //
export const collectionsFeatureSelector = collectionsSelectors.featureSelector;
export const selectCollectionsState = collectionsSelectors.selectState;

// ----- All Records ----- //
export const selectCollections = collectionsSelectors.selectRecords;
export const selectMoreCollectionsAvailable = collectionsSelectors.selectMoreRecordsAvailable;

// ----- One Records ----- //
export const selectCollectionById = collectionsSelectors.selectRecordById;

// ----- Selected Record ----- //
export const selectSelectedCollection = collectionsSelectors.selectSelectedRecord;
export const selectHasSelectedCollection = collectionsSelectors.selectHasSelectedRecord;


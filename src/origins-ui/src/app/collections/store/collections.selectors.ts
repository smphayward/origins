import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RecordSelectors } from 'src/app/shared/store/selector-factories';
import { CollectionInfo } from '../collections.models';
import { CollectionsState } from './collections.reducers';

const collectionsSelectors = new RecordSelectors<CollectionInfo, CollectionsState>('collections');

// ----- Feature/State ----- //
export const collectionsFeatureSelector = collectionsSelectors.featureSelector;
export const selectCollectionsState = collectionsSelectors.selectState;

// ----- All Records ----- //
export const selectCollections = collectionsSelectors.selectRecords;
export const selectMoreCollectionsAvailable = collectionsSelectors.selectMoreRecordsAvailable;

// ----- Selected Record ----- //
export const selectSelectedCollection = collectionsSelectors.selectSelectedRecord;
export const selectHasSelectedCollection = collectionsSelectors.selectHasSelectedRecord;


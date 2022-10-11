import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OriginsRecord } from '../models/record';
import { RecordState } from './models';


export class RecordSelectors<TRecord extends OriginsRecord, TState extends RecordState<TRecord>>{

  constructor(private readonly feature: string) {  }

  readonly featureSelector =  createFeatureSelector<TState>(this.feature);

  readonly selectState = createSelector(
    this.featureSelector,
    (state) => state
  );
  
  // ----- All Records ----- //
  readonly selectRecords = createSelector(
    this.selectState,
    (state) => state.records
  );

  readonly selectMoreRecordsAvailable = createSelector(
    this.selectState,
    (state) => state.moreRecordsAvailable
  );
  
  // ----- Selected Record ----- //
  readonly selectSelectedRecord = createSelector(
    this.selectState,
    (state) => state.selectedRecord
  );
  
  readonly selectHasSelectedRecord = createSelector(
    this.selectState,
    (state) => state.selectedRecordIndex !== undefined
  )

}






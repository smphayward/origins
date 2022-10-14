import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DocumentState } from './document.models';
import { OriginsDocument } from 'origins-common';


export class DocumentSelectors<TRecord extends OriginsDocument, TState extends DocumentState<TRecord>>{

  constructor(private readonly feature: string) {  }

  readonly featureSelector =  createFeatureSelector<TState>(this.feature);

  readonly selectState = createSelector(
    this.featureSelector,
    (state) => state
  );
  
  // ----- All Records ----- //
  readonly selectRecords = createSelector(
    this.selectState,
    (state) => state.documents
  );

  readonly selectMoreRecordsAvailable = createSelector(
    this.selectState,
    (state) => state.moreDocumentsAvailable
  );
  
  // ----- Specific Records ----- //
  readonly selectRecordById = (props: { id: string}) =>   
    createSelector(    
      this.selectState,
      (state) => state.documents.find(r => r.id === props.id)
    );

  // ----- Selected Record ----- //
  readonly selectSelectedRecord = createSelector(
    this.selectState,
    (state) => state.selectedDocument
  );
  
  readonly selectHasSelectedRecord = createSelector(
    this.selectState,
    (state) => state.selectedDocumentIndex !== undefined
  )

}






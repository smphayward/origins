import { createAction, props } from '@ngrx/store';

export class RecordActions<TRecord> {
  constructor(private feature: string) {}

  // ----- CRUD Operations ------ //
  readonly getAll = createAction(`[${this.feature}] Get All`);

  readonly searchByText = createAction(
    `[${this.feature}] Search by Text`,
    props<{ query: string }>()
  );

  readonly fetchMoreRecords = createAction(
    `[${this.feature}] Fetch More Records`
  );

  readonly recordsLoaded = createAction(
    `[${this.feature}] Result Loaded`,
    props<{
      records: Array<TRecord>;
      isContinuation: boolean;
      moreRecordsAvailable: boolean;
    }>()
  );

  // ------ SELECTED RECORD ----- //
  readonly moveToRecord = createAction(
    `[${this.feature}] Move To Record`,
    props<{ index: number }>()
  );

  readonly clearSelectedRecord = createAction(
    `[${this.feature}] Clear Selected Record`
  );

  readonly moveToPreviousRecord = createAction(
    `[${this.feature}] Move To Previous Record`
  );

  readonly moveToNextRecord = createAction(
    `[${this.feature}] Move To Next Record`
  );
}

export class RecordActionFactory<TRecord> {
  constructor(private feature: string) {}

  // ----- CRUD Operations ------ //
  createGetAllAction = () => {
    return createAction(`[${this.feature}] Get All`);
  };

  createSearchByTextAction = () => {
    return createAction(
      `[${this.feature}] Search by Text`,
      props<{ query: string }>()
    );
  };

  createFeatchMoreRecordsAction = () => {
    return createAction(`[${this.feature}] Fetch More Records`);
  };

  createRecordsLoadedAction = () => {
    return createAction(
      `[${this.feature}] Result Loaded`,
      props<{
        records: Array<TRecord>;
        isContinuation: boolean;
        moreRecordsAvailable: boolean;
      }>()
    );
  };

  // ------ SELECTED RECORD ----- //
  createMoveToRecordAction = () => {
    return createAction(
      `[${this.feature}] Move To Record`,
      props<{ index: number }>()
    );
  };

  createClearSelectedRecordAction = () => {
    return createAction(`[${this.feature}] Clear Selected Record`);
  };

  createMoveToPreviousRecordAction = () => {
    return createAction(`[${this.feature}] Move To Previous Record`);
  };

  createMoveToNextRecordAction = () => {
    return createAction(`[${this.feature}] Move To Next Record`);
  };
}

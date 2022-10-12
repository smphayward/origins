import { createAction, props } from '@ngrx/store';
import { OriginsRecord } from '../models/record';

export class RecordActions<TRecordForRead extends OriginsRecord, TRecordForWrite extends OriginsRecord> {
  constructor(private feature: string) {}

  // ----- READ OPERATIONS ------ //
  readonly getAll = createAction(`[${this.feature}] Get All`);

  readonly searchByText = createAction(
    `[${this.feature}] Search by Text`,
    props<{ query: string }>()
  );

  readonly fetchMoreRecords = createAction(
    `[${this.feature}] Fetch More Records`
  );

  readonly fetchRecordsSucceeded = createAction(
    `[${this.feature}] Fetch Records Succeeded`,
    props<{
      records: Array<TRecordForRead>;
      isContinuation: boolean;
      moreRecordsAvailable: boolean;
    }>()
  );

  readonly fetchRecordsFailed = createAction(
    `[${this.feature}] Fetch Records Failed`,
    props<{
      reason: string
    }>()
  );

  // ----- WRITE OPERATIONS ----- //
  readonly requestAddRecord = createAction(
    `[${this.feature}] Request Add`,
    props<{ record: TRecordForWrite }>()
  );

  readonly addRecordSucceeded = createAction(
    `[${this.feature}] Add Succeeded`,
    props<{ record: TRecordForRead }>()
  );

  readonly addRecordFailed = createAction(
    `[${this.feature}] Add Failed`,
    props<{ reason: string }>()
  );

  readonly requestUpdateRecord = createAction(
    `[${this.feature}] Request Update`,
    props<{ record: TRecordForWrite }>()
  );

  readonly updateRecordSucceeded = createAction(
    `[${this.feature}] Update Succeeded`,
    props<{ record: TRecordForRead }>()
  );

  readonly updateRecordFailed = createAction(
    `[${this.feature}] Update Failed`,
    props<{ reason: string }>()
  );

  readonly requestDeleteRecordById = createAction(
    `[${this.feature}] Request Delete by Id`,
    props<{ id: string }>()
  );

  readonly deleteRecordSucceeded = createAction(
    `[${this.feature}] Deleted by Id Succeeded`,
    props<{ id: string }>()
  );

  readonly deleteRecordFailed = createAction(
    `[${this.feature}] Deleted by Id Failed`,
    props<{ id: string, reason: string }>()
  )

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

// export class RecordActionFactory<TRecord> {
//   constructor(private feature: string) {}

//   // ----- CRUD Operations ------ //
//   createGetAllAction = () => {
//     return createAction(`[${this.feature}] Get All`);
//   };

//   createSearchByTextAction = () => {
//     return createAction(
//       `[${this.feature}] Search by Text`,
//       props<{ query: string }>()
//     );
//   };

//   createFeatchMoreRecordsAction = () => {
//     return createAction(`[${this.feature}] Fetch More Records`);
//   };

//   createRecordsLoadedAction = () => {
//     return createAction(
//       `[${this.feature}] Result Loaded`,
//       props<{
//         records: Array<TRecord>;
//         isContinuation: boolean;
//         moreRecordsAvailable: boolean;
//       }>()
//     );
//   };

//   // ------ SELECTED RECORD ----- //
//   createMoveToRecordAction = () => {
//     return createAction(
//       `[${this.feature}] Move To Record`,
//       props<{ index: number }>()
//     );
//   };

//   createClearSelectedRecordAction = () => {
//     return createAction(`[${this.feature}] Clear Selected Record`);
//   };

//   createMoveToPreviousRecordAction = () => {
//     return createAction(`[${this.feature}] Move To Previous Record`);
//   };

//   createMoveToNextRecordAction = () => {
//     return createAction(`[${this.feature}] Move To Next Record`);
//   };
// }

import { OriginsRecord } from '../models/record';
import { RecordState } from './models';


// ----- READ RECORDS ----- //
export const recordsLoaded = <TRecord extends OriginsRecord, TState extends RecordState<TRecord>>(
  state: TState,
  {
    records,
    isContinuation,
    moreRecordsAvailable,
  }: {
    records: TRecord[];
    isContinuation: boolean;
    moreRecordsAvailable: boolean;
  }
): TState => {
  let newState: TState;
  if (isContinuation) {
    // Append the documents
    newState = {
      ...state,
      moreRecordsAvailable,
      records: [...state.records, ...records],
    };
  } else {
    // Replace the documents
    newState = { ...state, records, moreRecordsAvailable };
  }
  // TODO: Do stuff with selectedRecord and selectedRecordIndex?
  return newState;
};

// ----- WRITE RECORDS ----- //
export const recordSuccessfullyAdded = <TRecord extends OriginsRecord, TState extends RecordState<TRecord>>(
  state: TState,
  { record }: { record: TRecord}): TState => {
    return {
      ...state,
      records: [...state.records, record]
    };
  }

export const recordSuccessfullyUpdated = <TRecord extends OriginsRecord, TState extends RecordState<TRecord>>(
  state: TState,
  { record }: { record: TRecord}): TState => {
    const index = state.records.findIndex(r => r.id == record.id);
    if(index === -1){
      // Treat as an Add
      // This probably shouldn't happen but you never know
      return {
        ...state,
        records: [...state.records, record]
      };      
    }

    return {
      ...state,
      records: [
        ...state.records.slice(0, index),
        record,
        ...state.records.slice(index + 1),
      ],
    };
  }  

export const recordSuccessfullyDeleted = <TRecord extends OriginsRecord, TState extends RecordState<TRecord>>(
  state: TState,
  { id }: { id: string }
): TState => {
    const index = state.records.findIndex((record) => record.id === id);
    if (index !== -1) {
      return {
        ...state,
        records: [
          ...state.records.slice(0, index),
          ...state.records.slice(index + 1),
        ],
      };
    }
    return state;
};


// ----- SELECTED RECORD ----- //
export const clearSelectedRecord = <
  TRecord extends OriginsRecord,
  TState extends RecordState<TRecord>
>(
  state: TState
): TState => {
  return getStateWithSelectedIndexChange(state, undefined);
};

export const moveToRecord = <TRecord extends OriginsRecord, TState extends RecordState<TRecord>>(
  state: TState,
  { index }: { index: number }
): TState => {
  return getStateWithSelectedIndexChange(state, index);
};

export const moveToPreviousRecord = <
  TRecord extends OriginsRecord,
  TState extends RecordState<TRecord>
>(
  state: TState
): TState => {
  const currentIndex = state.selectedRecordIndex;
  if(currentIndex !== undefined){
    return getStateWithSelectedIndexChange(state, currentIndex - 1);  
  }
  return getStateWithSelectedIndexChange(state, undefined);
};

export const moveToNextRecord = <TRecord extends OriginsRecord, TState extends RecordState<TRecord>>(
  state: TState
): TState => {
  const currentIndex = state.selectedRecordIndex;
  if(currentIndex !== undefined){
    return getStateWithSelectedIndexChange(state, currentIndex + 1);  
  }
  return getStateWithSelectedIndexChange(state, undefined);
};

const getStateWithSelectedIndexChange = <
  TRecord extends OriginsRecord,
  TState extends RecordState<TRecord>
>(
  state: TState,
  index: number | undefined
): TState => {
  let selectedRecord: TRecord | undefined;
  let selectedRecordIndex: number | undefined;
  if (index === undefined || state.records.length === 0) {
    selectedRecordIndex = undefined;
    selectedRecord = undefined;
  } else if (index < 0) {
    selectedRecordIndex = 0;
    selectedRecord = state.records[selectedRecordIndex];
  } else if (index >= state.records.length) {
    selectedRecordIndex = state.records.length - 1;
    selectedRecord = state.records[selectedRecordIndex];
  } else {
    selectedRecordIndex = index;
    selectedRecord = state.records[selectedRecordIndex];
  }
  return {
    ...state,
    selectedRecord,
    selectedRecordIndex,
  };
};

// on(clearSelectedCollection, (state) => {

// }),

// on(moveToCollectionRecord, (state, {index}) => {
//   // TODO:
//   return state;
// }),

// on(moveToPreviousCollection, (state) => {
//   // TODO:
//   return state;
// }),

// on(moveToNextCollection, (state) => {
//   // TODO:
//   return state;
// })

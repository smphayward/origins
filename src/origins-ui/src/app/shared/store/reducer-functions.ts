import { RecordState } from './models';

export const recordsLoaded = <TRecord, TState extends RecordState<TRecord>>(
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
  console.log("moreRecordsAvailable", moreRecordsAvailable);
  return newState;
};

// ----- SELECTED RECORD ----- //
export const clearSelectedRecord = <
  TRecord,
  TState extends RecordState<TRecord>
>(
  state: TState
): TState => {
  return getStateWithSelectedIndexChange(state, undefined);
};

export const moveToRecord = <TRecord, TState extends RecordState<TRecord>>(
  state: TState,
  { index }: { index: number }
): TState => {
  return getStateWithSelectedIndexChange(state, index);
};

export const moveToPreviousRecord = <
  TRecord,
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

export const moveToNextRecord = <TRecord, TState extends RecordState<TRecord>>(
  state: TState
): TState => {
  const currentIndex = state.selectedRecordIndex;
  if(currentIndex !== undefined){
    return getStateWithSelectedIndexChange(state, currentIndex + 1);  
  }
  return getStateWithSelectedIndexChange(state, undefined);
};

const getStateWithSelectedIndexChange = <
  TRecord,
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

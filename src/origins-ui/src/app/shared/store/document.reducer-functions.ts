import { OriginsDocument } from 'origins-common';
import { DocumentState } from './document.models';

// ----- READ DOCUMENTS ----- //
export const documentsLoaded = <
  TDocument extends OriginsDocument,
  TState extends DocumentState<TDocument>
>(
  state: TState,
  {
    documents,
    isContinuation,
    moreDocumentsAvailable,
  }: {
    documents: TDocument[];
    isContinuation: boolean;
    moreDocumentsAvailable: boolean;
  }
): TState => {
  let newState: TState;
  if (isContinuation) {
    // Append the documents
    newState = {
      ...state,
      moreDocumentsAvailable,
      documents: [...state.documents, ...documents],
    };
  } else {
    // Replace the documents
    newState = { ...state, documents, moreDocumentsAvailable };
  }
  // TODO: Do stuff with selectedDocument and selectedRecordIndex?
  return newState;
};

// ----- WRITE DOCUMENTS ----- //
export const documentSuccessfullyAdded = <
  TDocument extends OriginsDocument,
  TState extends DocumentState<TDocument>
>(
  state: TState,
  { document }: { document: TDocument }
): TState => {
  return {
    ...state,
    documents: [...state.documents, document],
  };
};

export const documentSuccessfullyUpdated = <
  TDocument extends OriginsDocument,
  TState extends DocumentState<TDocument>
>(
  state: TState,
  { document }: { document: TDocument }
): TState => {
  const index = state.documents.findIndex((r) => r.id == document.id);
  if (index === -1) {
    // Treat as an Add
    // This probably shouldn't happen but you never know
    return {
      ...state,
      documents: [...state.documents, document],
    };
  }

  const documents = [...state.documents];
  documents[index] = { ...document };

  return {
    ...state,
    documents,
  };
};

export const documentSuccessfullyDeleted = <
  TDocument extends OriginsDocument,
  TState extends DocumentState<TDocument>
>(
  state: TState,
  { id }: { id: string }
): TState => {
  const index = state.documents.findIndex((document) => document.id === id);
  if (index !== -1) {
    return {
      ...state,
      documents: [
        ...state.documents.slice(0, index),
        ...state.documents.slice(index + 1),
      ],
    };
  }
  return state;
};

// ----- SELECTED RECORD ----- //
export const clearSelectedDocument = <
  TDocument extends OriginsDocument,
  TState extends DocumentState<TDocument>
>(
  state: TState
): TState => {
  return getStateWithSelectedIndexChange(state, undefined);
};

export const moveToDocument = <
TDocument extends OriginsDocument,
  TState extends DocumentState<TDocument>
>(
  state: TState,
  { index }: { index: number }
): TState => {
  return getStateWithSelectedIndexChange(state, index);
};

export const moveToPreviousDocument = <
TDocument extends OriginsDocument,
  TState extends DocumentState<TDocument>
>(
  state: TState
): TState => {
  const currentIndex = state.selectedDocumentIndex;
  if (currentIndex !== undefined) {
    return getStateWithSelectedIndexChange(state, currentIndex - 1);
  }
  return getStateWithSelectedIndexChange(state, undefined);
};

export const moveToNextDocument = <
TDocument extends OriginsDocument,
  TState extends DocumentState<TDocument>
>(
  state: TState
): TState => {
  const currentIndex = state.selectedDocumentIndex;
  if (currentIndex !== undefined) {
    return getStateWithSelectedIndexChange(state, currentIndex + 1);
  }
  return getStateWithSelectedIndexChange(state, undefined);
};

const getStateWithSelectedIndexChange = <
  TDocument extends OriginsDocument,
  TState extends DocumentState<TDocument>
>(
  state: TState,
  index: number | undefined
): TState => {
  let selectedDocument: TDocument | undefined;
  let selectedDocumentIndex: number | undefined;
  if (index === undefined || state.documents.length === 0) {
    selectedDocumentIndex = undefined;
    selectedDocument = undefined;
  } else if (index < 0) {
    selectedDocumentIndex = 0;
    selectedDocument = state.documents[selectedDocumentIndex];
  } else if (index >= state.documents.length) {
    selectedDocumentIndex = state.documents.length - 1;
    selectedDocument = state.documents[selectedDocumentIndex];
  } else {
    selectedDocumentIndex = index;
    selectedDocument = state.documents[selectedDocumentIndex];
  }
  return {
    ...state,
    selectedDocument,
    selectedDocumentIndex,
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

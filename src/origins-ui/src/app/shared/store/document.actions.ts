import { createAction, props } from '@ngrx/store';
import { OriginsDocument } from 'origins-common';

export class DocumentActions<
  TDocumentForRead extends OriginsDocument,
  TDocumentForWrite extends OriginsDocument
> {
  constructor(private feature: string) {}

  // ██████  ███████  █████  ██████
  // ██   ██ ██      ██   ██ ██   ██
  // ██████  █████   ███████ ██   ██
  // ██   ██ ██      ██   ██ ██   ██
  // ██   ██ ███████ ██   ██ ██████

  readonly getAll = createAction(`[${this.feature}] Get All`);

  readonly searchByText = createAction(
    `[${this.feature}] Search by Text`,
    props<{ query: string }>()
  );

  readonly fetchMoreDocuments = createAction(
    `[${this.feature}] Fetch More Documents`
  );

  readonly fetchDocumentsSucceeded = createAction(
    `[${this.feature}] Documents Documents Succeeded`,
    props<{
      documents: Array<TDocumentForRead>;
      isContinuation: boolean;
      moreDocumentsAvailable: boolean;
    }>()
  );

  readonly fetchDocumentsFailed = createAction(
    `[${this.feature}] Fetch Documents Failed`,
    props<{
      reason: string;
    }>()
  );

  // ██     ██ ██████  ██ ████████ ███████
  // ██     ██ ██   ██ ██    ██    ██
  // ██  █  ██ ██████  ██    ██    █████
  // ██ ███ ██ ██   ██ ██    ██    ██
  //  ███ ███  ██   ██ ██    ██    ███████

  readonly requestAddDocument = createAction(
    `[${this.feature}] Request Add Document`,
    props<{ document: TDocumentForWrite }>()
  );

  readonly addDocumentSucceeded = createAction(
    `[${this.feature}] Add Document Succeeded`,
    props<{ document: TDocumentForRead }>()
  );

  readonly addDocumentFailed = createAction(
    `[${this.feature}] Add Document Failed`,
    props<{ reason: string }>()
  );

  readonly requestUpdateDocument = createAction(
    `[${this.feature}] Request Update Document`,
    props<{ document: TDocumentForWrite }>()
  );

  readonly updateDocumentSucceeded = createAction(
    `[${this.feature}] Update Document Succeeded`,
    props<{ document: TDocumentForRead }>()
  );

  readonly updateDocumentFailed = createAction(
    `[${this.feature}] Update Document Failed`,
    props<{ reason: string }>()
  );

  readonly requestDeleteDocumentById = createAction(
    `[${this.feature}] Request Delete Document by Id`,
    props<{ id: string }>()
  );

  readonly deleteDocumentSucceeded = createAction(
    `[${this.feature}] Deleted Document Succeeded`,
    props<{ id: string }>()
  );

  readonly deleteDocumentFailed = createAction(
    `[${this.feature}] Deleted Document Failed`,
    props<{ id: string; reason: string }>()
  );

  // ███████ ███████ ██      ███████  ██████ ████████
  // ██      ██      ██      ██      ██         ██
  // ███████ █████   ██      █████   ██         ██
  //      ██ ██      ██      ██      ██         ██
  // ███████ ███████ ███████ ███████  ██████    ██

  readonly moveToDocument = createAction(
    `[${this.feature}] Move To Document`,
    props<{ index: number }>()
  );

  readonly clearSelectedDocument = createAction(
    `[${this.feature}] Clear Selected Document`
  );

  readonly moveToPreviousDocument = createAction(
    `[${this.feature}] Move To Previous Document`
  );

  readonly moveToNextDocument = createAction(
    `[${this.feature}] Move To Next Document`
  );

  // ██████  ██    ██ ██████   ██████  ███████
  // ██   ██ ██    ██ ██   ██ ██       ██
  // ██████  ██    ██ ██████  ██   ███ █████
  // ██      ██    ██ ██   ██ ██    ██ ██
  // ██       ██████  ██   ██  ██████  ███████

  readonly requestPurgeDocuments = createAction(
    `[${this.feature}] Request Purge Documents`,
    props<{ lucene?: string }>()
  );

  readonly purgeDocumentsSucceeded = createAction(
    `[${this.feature}] Purge Documents Succeeded`,
    props<{ documentsDeleted?: number }>()
  );

  readonly purgeDocumentsFailed = createAction(
    `[${this.feature}] Purge Documents Failed`
  );

  // ██████  ██████   ██████   ██████ ███████ ███████ ███████
  // ██   ██ ██   ██ ██    ██ ██      ██      ██      ██
  // ██████  ██████  ██    ██ ██      █████   ███████ ███████
  // ██      ██   ██ ██    ██ ██      ██           ██      ██
  // ██      ██   ██  ██████   ██████ ███████ ███████ ███████

  readonly requestProcessDocument = createAction(
    `[${this.feature}] Request Process Document`,
    props<{ id: string }>()
  );

  readonly processDocumentSucceeded = createAction(
    `[${this.feature}] Process Document Succeeded`,
    props<{ id: string }>()
  );

  readonly processDocumentFailed = createAction(
    `[${this.feature}] Process Document Failed`,
    props<{ id: string }>()
  );
}

export interface RecordState<TRecord> {
  records: TRecord[];
  moreRecordsAvailable: boolean;

  selectedRecordIndex?: number;
  selectedRecord?: TRecord;

}
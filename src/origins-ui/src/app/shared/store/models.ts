import { OriginsRecord } from "../models/record";

export interface RecordState<TRecord extends OriginsRecord> {
  records: TRecord[];
  moreRecordsAvailable: boolean;

  selectedRecordIndex?: number;
  selectedRecord?: TRecord;

}
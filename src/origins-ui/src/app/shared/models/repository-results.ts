export interface GeneralResult {
  success: boolean;
  statusCode: number;
  message: string;
}

// TODO: Should extend GeneralResult
export interface GetManyResult<T> {
  records: Array<T>;
  continuationToken?: string;
}

export interface AddResult<TRecord> extends GeneralResult {
  record?: TRecord;
}

export interface UpdateResult<TRecord> extends GeneralResult {
  record?: TRecord;
}

export interface DeleteResult extends GeneralResult {
  // Might be some stuff here at some point
}
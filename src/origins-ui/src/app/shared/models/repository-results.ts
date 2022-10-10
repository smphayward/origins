
// Used for GetAll and Search
export interface GetManyResult<T> {
  records: Array<T>;
  continuationToken?: string;
}


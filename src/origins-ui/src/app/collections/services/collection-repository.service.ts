import { Injectable } from '@angular/core';
import { MockRepositoryService } from 'src/app/shared/services/mock-repository.service';
import { Collection, CollectionInfo } from '../collections.models';
import { mockCollections } from './collection-mock-data';

@Injectable({
  providedIn: 'root',
})
export class CollectionRepositoryService extends MockRepositoryService<CollectionInfo, Collection> {
  constructor() {
    super(mockCollections);
  }

  protected override getRecordForRead(record: Collection): CollectionInfo {
    return {
      ...record,
      exists: true
    };
  }
}

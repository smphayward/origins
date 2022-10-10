import { Injectable } from '@angular/core';
import { MockRepositoryService } from 'src/app/shared/services/mock-repository.service';
import { CollectionInfo } from '../collections.models';
import { mockCollections } from './collection-mock-data';

@Injectable({
  providedIn: 'root',
})
export class CollectionRepositoryService extends MockRepositoryService<CollectionInfo> {
  constructor() {
    super(mockCollections);
  }
}

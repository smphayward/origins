import { Injectable } from '@angular/core';
import { MockRepositoryService } from 'src/app/shared/services/mock-repository.service';
import { ItemInfo } from '../items.models';
import { mockItemsBig } from './items-mock-data';

@Injectable({
  providedIn: 'root',
})
export class ItemRepositoryService extends MockRepositoryService<ItemInfo> {
  constructor() {
    super(mockItemsBig);
  }
}
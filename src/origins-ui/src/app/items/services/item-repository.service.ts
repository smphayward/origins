import { Injectable } from '@angular/core';
import { MockRepositoryService } from 'src/app/shared/services/mock-repository.service';
import { Item, ItemInfo } from '../items.models';
import { mockItemsBig } from './items-mock-data';

@Injectable({
  providedIn: 'root',
})
export class ItemRepositoryService extends MockRepositoryService<ItemInfo, Item> {
  constructor() {
    super(mockItemsBig);
  }

  protected override getRecordForRead(record: Item): ItemInfo {
    return {
      ...record,
      _links: {
        thumb: { _href: ''},
        webdav: { _href: ''},
        self: { _href: ''},
      }      
    };
  }
}
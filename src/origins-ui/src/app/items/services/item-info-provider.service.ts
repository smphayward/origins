import { Injectable } from '@angular/core';
import { MockObservableItemInfoProvider } from 'origins-common/items';
import { mockItemsBig } from './items-mock-data';


@Injectable({
  providedIn: 'root',
})
export class ItemInfoProvider extends MockObservableItemInfoProvider{
  constructor(){
    super(mockItemsBig)
  }
}

// @Injectable({
//   providedIn: 'root',
// })
// export class ItemProviderService extends MockObservableDocumentProvider<ItemInfo, Item> {
//   constructor() {
//     super(mockItemsBig);
//   }

//   protected override getDocumentForRead(record: Item): ItemInfo {
//     return {
//       ...record,
//       _links: {
//         thumb: { _href: ''},
//         webdav: { _href: ''},
//         self: { _href: ''},
//       }      
//     };
//   }
// }
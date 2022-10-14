import { Injectable } from '@angular/core';
import { mockCollections } from './collection-mock-data';
import { MockObservableCollectionInfoProvider } from 'origins-common/collections'


@Injectable({
  providedIn: 'root',
})
export class CollectionInfoProvider extends MockObservableCollectionInfoProvider{
  constructor(){
    super(mockCollections)
  }
}



// @Injectable({
//   providedIn: 'root',
// })
// export class CollectionRepositoryService extends MockRepositoryService<CollectionInfo, Collection> {
//   constructor() {
//     super(mockCollections);
//   }

//   protected override getRecordForRead(record: Collection): CollectionInfo {
//     return {
//       ...record,
//       exists: true
//     };
//   }
// }

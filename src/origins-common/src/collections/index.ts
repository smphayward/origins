import { DocumentProvider, Link, MockObservableDocumentProvider, ObservableDocumentProvider, OriginsDocument } from "..";

// ███    ███  ██████  ██████  ███████ ██      ███████ 
// ████  ████ ██    ██ ██   ██ ██      ██      ██      
// ██ ████ ██ ██    ██ ██   ██ █████   ██      ███████ 
// ██  ██  ██ ██    ██ ██   ██ ██      ██           ██ 
// ██      ██  ██████  ██████  ███████ ███████ ███████ 

export interface Collection extends OriginsDocument {
  name: string;
  rootDirectory: string;
}

export interface CollectionInfo extends Collection {
  rootDirectoryExists: boolean;
  // _links: {
  //   self?: Link;
  // }
}

export type CollectionDictionary = { [collectionId: string]: Collection  };

export type CollectionInfoDictionary = { [collectionId: string]: CollectionInfo  };

// ██████  ██████   ██████  ██    ██ ██ ██████  ███████ ██████  
// ██   ██ ██   ██ ██    ██ ██    ██ ██ ██   ██ ██      ██   ██ 
// ██████  ██████  ██    ██ ██    ██ ██ ██   ██ █████   ██████  
// ██      ██   ██ ██    ██  ██  ██  ██ ██   ██ ██      ██   ██ 
// ██      ██   ██  ██████    ████   ██ ██████  ███████ ██   ██ 

export interface CollectionProvider extends DocumentProvider<Collection> {

}

export interface CollectionInfoProvider extends DocumentProvider<CollectionInfo, Collection> {

}

export interface ObservableItemProvider extends ObservableDocumentProvider<Collection> {

}

export interface ObservableItemInfoProvider extends ObservableDocumentProvider<CollectionInfo, Collection> {

}

// ███    ███  ██████   ██████ ██   ██ 
// ████  ████ ██    ██ ██      ██  ██  
// ██ ████ ██ ██    ██ ██      █████   
// ██  ██  ██ ██    ██ ██      ██  ██  
// ██      ██  ██████   ██████ ██   ██ 

export class MockObservableCollectionInfoProvider 
  extends MockObservableDocumentProvider<CollectionInfo, Collection>
  implements ObservableItemInfoProvider {

  protected getDocumentForRead(document: Collection): CollectionInfo {
    return {
      ...document,
      rootDirectoryExists: true
    };
  }

}
interface Document {
  id: string;
}

export interface MultipleDocumentsResult<TDocument extends Document> {
  documents: TDocument[];
  continuationToken?: string;
}

interface Link {
  _href: string;
}
export interface IndexRecord extends Document {
  id: string;
  collectionId: string;
  fileRelativePath: string;
  fileSizeBytes: number;
  fileCreated: string;
  fileModified: string;
  filename: string;
  fileExtension: string;
  type: string;
  mime: string;
  height: number;
  width: number;
  _links: {
    thumb: Link;
    webdav: Link;
    self?: Link;
  }
}

export interface MultipleIndexRecordsResult extends MultipleDocumentsResult<IndexRecord> {
}

export const blankIndexRecord: IndexRecord = {
  id: '',
  collectionId: '',
  fileRelativePath: '',
  fileSizeBytes: 0,
  fileCreated: '',
  fileModified: '',
  filename: '',
  fileExtension: '',
  type: '',
  mime: '',
  height: 0,
  width: 0,
  _links: {
    thumb: {
      _href: ''
    },
    webdav: {
      _href: ''
    }
  }
}


export interface Options {

  // TODO: Consider having many image modes
  useLargeImages: boolean;
  
  // List, Grid, Masonry

  // Dark/Light Theme
    
  

}
interface Link {
  _href: string;
}
export interface IndexRecord {
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
  _links?: {
    thumb?: Link;
    webdav?: Link;
    self?: Link;
  }
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
  _links: {}
}

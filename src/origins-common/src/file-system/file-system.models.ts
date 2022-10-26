import { parseFullPath } from './file-system.utils';

// Made everyting immutable. How well is that going to work?

export class FileSystemObjectPathInfo {
  public readonly fullPath: string;
  public readonly parentFullPath?: string;
  public readonly collectionId: string;
  public readonly relativePath: string;
  public readonly name: string;
  public readonly pathParts: string[];
  public readonly level: number;

  constructor(fullPath: string) {
    const parsed = parseFullPath(fullPath);

    this.fullPath = parsed.fullPath;
    this.parentFullPath = parsed.parentFullPath;
    this.collectionId = parsed.collectionId;
    this.relativePath = parsed.relativePath;
    this.name = parsed.name;
    this.pathParts = parsed.pathParts;
    this.level = parsed.level;
  }

}

export abstract class FileSystemObject extends FileSystemObjectPathInfo {
  // public readonly fullPath: string;
  // public readonly parentFullPath?: string;
  // public readonly collectionId: string;
  // public readonly relativePath: string;
  // public readonly name: string;
  // public readonly pathParts: string[];
  // public readonly level: number;
  public abstract get objectType(): 'directory' | 'file';

  constructor(fullPath: string, public readonly createdDate: Date, public readonly lastModifiedDate: Date) {
    super(fullPath);
    // const parsed = parseFullPath(fullPath);

    // this.fullPath = parsed.fullPath;
    // this.parentFullPath = parsed.parentFullPath;
    // this.collectionId = parsed.collectionId;
    // this.relativePath = parsed.relativePath;
    // this.name = parsed.name;
    // this.pathParts = parsed.pathParts;
    // this.level = parsed.level;
  }
}

export class FileSystemFile extends FileSystemObject {
  public override get objectType(): 'file' {
    return 'file';
  }
  constructor(
    fullPath: string,
    createdDate: Date,
    lastModifiedDate: Date,
    public readonly contentType: string,
    public readonly contentLength: number,
  ) {
    super(fullPath, createdDate, lastModifiedDate);
  }
}


export class FileSystemDirectory extends FileSystemObject {
  public override get objectType(): 'directory' {
    return 'directory';
  }
  constructor(
    fullPath: string,
    createdDate: Date,
    lastModifiedDate: Date
  ) {
    super(fullPath, createdDate, lastModifiedDate);
  }
}

export type BasicFileSystemObject = FileSystemFile | FileSystemDirectory;

// export type FileSystemDirectoryDictionary = { [id: string]: FileSystemDirectory };

// // There is a LOT of redundance here. This is true. Maybe this should be a class.
// export interface FileSystemObject {
//   // E.g. 'collection-id/foo/bar/baz/quux.jpg'
//   fullPath: string;
//   // E.g. 'collection-id'
//   collectionId: string;
//   // E.g. '/foo/bar/baz/quux.jpg'
//   relativePath: string;
//   // E.g. 'quux.jpg'
//   name: string;
//   // E.g. ['collection-id', 'foo', 'bar', 'baz', 'quux.jpg']
//   pathParts: string[]
//   objectType: 'directory' | 'file';
// }

// export interface FileSystemFile extends FileSystemObject {
//   objectType: 'file';
// }

// export interface FileSystemDirectory extends FileSystemObject {
//   objectType: 'directory';
//   children?: FileSystemObjectDictionary;
// }

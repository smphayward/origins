import { extractDirectoriesFromArray, extractFilesFromArray } from "./file-system-array.utils";
import { FileSystemDirectory, FileSystemFile, FileSystemObject } from "./file-system.models";

export class FileSystemDirectoryWithChildrenArray extends FileSystemObject {
  public override get objectType(): 'directory' {
    return 'directory';
  }

  // Going to need something like this but haven't determined if we're saying with dictionaries
  // or going with arrays

  public readonly childDirectories?: FileSystemDirectoryArray;
  public readonly childFiles?: FileSystemFileArray;

  constructor(
    fullPath: string,
    createdDate: Date,
    lastModifiedDate: Date,
    public readonly children: FileSystemObjectArray,
  ) {
    super(fullPath, createdDate, lastModifiedDate);

    this.childDirectories = extractDirectoriesFromArray(children);
    this.childFiles = extractFilesFromArray(children);
  }

  clone = (children?: FileSystemObjectArray): FileSystemDirectoryWithChildrenArray => {
    return new FileSystemDirectoryWithChildrenArray(
      this.fullPath,
      this.createdDate,
      this.lastModifiedDate,
      children ?? this.children,
    );
  };

  static fromFileSystemDirectory = (original: FileSystemDirectory): FileSystemDirectoryWithChildrenArray => {
    return new FileSystemDirectoryWithChildrenArray(
      original.fullPath, 
      original.createdDate, 
      original.lastModifiedDate,
      []);
  }

}

export type FileSystemObjectArrayItem = FileSystemFile | FileSystemDirectoryWithChildrenArray;
export type FileSystemObjectArray = FileSystemObjectArrayItem[];
export type FileSystemFileArray = FileSystemFile[];
export type FileSystemDirectoryArray = FileSystemDirectoryWithChildrenArray[];
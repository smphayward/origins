import { extractDirectoriesFromDictionary, extractFilesFromDictionary } from "./file-system-dictionary.utils";
import { FileSystemDirectory, FileSystemFile, FileSystemObject } from "./file-system.models";

export class FileSystemDirectoryWithChildrenDictionary extends FileSystemObject {
  public override get objectType(): 'directory' {
    return 'directory';
  }

  // Going to need something like this but haven't determined if we're saying with dictionaries
  // or going with arrays

  public readonly childDirectories?: FileSystemDirectoryDictionary;
  public readonly childFiles?: FileSystemFileDictionary;

  constructor(
    fullPath: string,
    createdDate: Date,
    lastModifiedDate: Date,
    public readonly children: FileSystemObjectDictionary,
  ) {
    super(fullPath, createdDate, lastModifiedDate);

    this.childDirectories = extractDirectoriesFromDictionary(children);
    this.childFiles = extractFilesFromDictionary(children);
  }

  clone = (children?: FileSystemObjectDictionary): FileSystemDirectoryWithChildrenDictionary => {
    return new FileSystemDirectoryWithChildrenDictionary(
      this.fullPath,
      this.createdDate,
      this.lastModifiedDate,
      children ?? this.children,
    );
  };

  static fromFileSystemDirectory = (original: FileSystemDirectory): FileSystemDirectoryWithChildrenDictionary => {
    return new FileSystemDirectoryWithChildrenDictionary(original.fullPath, original.createdDate, original.lastModifiedDate, {});
  }

}


export type FileSystemObjectDictionary = { [id: string]: FileSystemFile | FileSystemDirectoryWithChildrenDictionary };
export type FileSystemDirectoryDictionary = { [id: string]: FileSystemDirectoryWithChildrenDictionary };
export type FileSystemFileDictionary = { [id: string]: FileSystemFile };

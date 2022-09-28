import { promises as fs } from "fs";
import * as fsSync from "fs";
import * as path from "path";


export enum FileSystemObjectType {
  NotFound,
  Directory,
  File,
}

export const getPathType = async (fileOrDirPath: string): Promise<FileSystemObjectType> => {
  if (!fsSync.existsSync(fileOrDirPath)) {
    return FileSystemObjectType.NotFound;
  }
  const stat = await fs.lstat(fileOrDirPath);
  if (stat.isDirectory()) {
    return FileSystemObjectType.Directory;
  }
  if (stat.isFile()) {
    return FileSystemObjectType.File;
  }
  // It's another type of thing that we don't support
  return FileSystemObjectType.NotFound;
}
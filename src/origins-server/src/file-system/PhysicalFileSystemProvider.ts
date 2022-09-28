// import { promises as fs } from "fs";
// import * as fsSync from "fs";
// import * as path from "path";

// import {
//   DirectoryInfo,
//   FileSystemObjectType,
//   FileSystemObject,
// } from "./models";
// import { Stream } from "stream";
// import { FileSystemProvider } from "./FileSystemProvider";

// export class PhysicalFileSystemProvider implements FileSystemProvider {
  
//   public async pathType(fileOrDirPath: string): Promise<FileSystemObjectType> {
//     if (!fsSync.existsSync(fileOrDirPath)) {
//       return FileSystemObjectType.NotFound;
//     }
//     const stat = await fs.lstat(fileOrDirPath);
//     if (stat.isDirectory()) {
//       return FileSystemObjectType.Directory;
//     }
//     if (stat.isFile()) {
//       return FileSystemObjectType.File;
//     }
//     // It's another type of thing that we don't support
//     return FileSystemObjectType.NotFound;
//   }

//   // public async directoryInfo(dirPath: string): Promise<DirectoryInfo> {
//   //   const dir = await fs.readdir(dirPath);
//   //   const contents = await fs.readdir(dirPath);
//   //   console.log(contents);
//   //   const formattedContents = await Promise.all(
//   //     contents.map(async (c) => ({
//   //       name: c, //path.parse(c).name,
//   //       type: await this.pathType(path.join(dirPath, c)),
//   //     }))
//   //   );
//   //   console.log(formattedContents);
//   //   return {
//   //     name: path.parse(dirPath).name,
//   //     contents: formattedContents.filter(
//   //       (item) => item.type !== FileSystemObjectType.NotFound
//   //     ),
//   //   };
//   // }

// }

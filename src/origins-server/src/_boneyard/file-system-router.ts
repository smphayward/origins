// import express from "express";
// import { urlJoin } from "url-join-ts";
// import { RequestUtil } from "../RequestUtil";
// import { FileSystem } from "./FileSystem";
// import { DirectoryInfoWithHypermedia, FileSystemObjectType } from "./models";

// export const fileSystemRouter = express.Router();

// const rootDirectory = "/home/shaun/repos/origins/origins-test-folders/photos2";
// const fileSystem = new FileSystem();

// fileSystemRouter.get("*", async (req, res) => {
//   const fsPath: string = rootDirectory + RequestUtil.getFileSystemPath(req);

//   switch (await fileSystem.pathType(fsPath)) {
//     case FileSystemObjectType.NotFound:
//       res.status(404);
//       return res.send("not found");

//     case FileSystemObjectType.Directory:
//       // Get the directory info
//       const dirInfo = await fileSystem.directoryInfo(fsPath);

//       // Add Hypermedia
//       const dirInfoHypermedia: DirectoryInfoWithHypermedia = {
//         name: dirInfo.name,
//         contents: dirInfo.contents,
//       };

//       const originalUrl = req.headers["_originsRequestUrl"] as
//         | string
//         | undefined;
//       if (originalUrl) {
//         // Directory's hypermedia
//         dirInfoHypermedia._links = {
//           self: {
//             href: originalUrl,
//           },
//         };

//         // Contents' hypermedia
//         dirInfoHypermedia.contents = dirInfoHypermedia.contents.map((c) => {
//           c._links = {
//             self: {
//               href: urlJoin(originalUrl, encodeURI(c.name)),
//             },
//           };
//           return c;
//         });
//       }

//       return res.send(dirInfoHypermedia);

//     case FileSystemObjectType.File:
//       return res.download(fsPath);

//     default:
//       break;
//   }

//   return res.status(500);
// });


// // Creates a directory
// fileSystemRouter.mkcol('*', async (req, res) => {

// });

// // Uploads a file
// fileSystemRouter.put('*', async (req, res) => {

// });

// // https://yandex.com/dev/disk/doc/dg/reference/move.html

// fileSystemRouter.move('*', async (req, res) => {

//   const destination = req.header("Destination");
//   const overwrite = req.header("Overwrite");




// });

// fileSystemRouter.copy('*', async (req, res) => {

//   const destination = req.header("Destination");
//   const overwrite = req.header("Overwrite");

// });

// fileSystemRouter.delete('*', async (req, res) => {

// });
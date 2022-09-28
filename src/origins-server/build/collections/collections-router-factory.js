"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCollectionsRouter = void 0;
const DocumentRouterFactory_1 = require("../documents/DocumentRouterFactory");
const createCollectionsRouter = (collectionProvider) => {
    return (0, DocumentRouterFactory_1.createDocumentRouter)(collectionProvider);
};
exports.createCollectionsRouter = createCollectionsRouter;
// export const createCollectionsRouter = (
//   collectionProvider: CollectionProvider): Router => {
//   const collectionsRouter = express.Router();
//   // const webDAVServers: { [collectionId: string]: webdav.WebDAVServer } = {};
//   collectionsRouter
//     // ===== CRUD OPERATIONS ===== //
//     .get("/", async (req, res) => {
//       const result = await collectionProvider.getAll();
//       return res.send(result);
//     })
//     .get("/:id", async (req, res) => {
//       const collectionId = req.params.id;
//       const result = await collectionProvider.get(collectionId);
//       if (!result) {
//         return res.status(404).send("Not found.");
//       }
//       return res.send(result);
//     })
//     .put("/:id", async (req, res) => {
//       const collectionId = req.params.id;
//       console.log(req.body);
//       const collection = req.body as Collection;
//       if(!collection) {
//         return res.status(400).send("Body is blank or is not in the right format.");
//       }
//       if(collection.id != collectionId) {
//         return res.status(400).send("Id in body does not match Id in URL.");
//       }
//       const result = await collectionProvider.put(collection);
//       return res.send(collection);
//     })
//     .delete("/:id", async (req, res) => {
//       const collectionId = req.params.id;
//       const result = await collectionProvider.delete(collectionId);
//       if (!result) {
//         return res.status(404).send("Not found.");
//       }
//       return res.status(200).send("Success");
//     })
//     // // ===== WEBDAV ===== //
//     // .all("/:id/webdav*", async (req, res) => {
//     //   const collectionId = req.params.id;
//     //   // First, does the collection exist?
//     //   const result = await collectionProvider.get(collectionId);
//     //   if (!result) {
//     //     return res.status(404);
//     //   }
//     //   // Second, does the webDAVServer object exist?
//     //   webDAVServers[collectionId] =
//     //     webDAVServers[collectionId] ??
//     //     WebDAVServerFactory(result.rootDirectory);
//     //   // Third, strip the url
//     //   const urlPortionToStrip = "/" + collectionId + "/webdav";
//     //   req.url = req.url.substring(urlPortionToStrip.length);
//     //   console.log("passing to webdav", req.url);
//     //   // Finally, do the things!
//     //   webDAVServers[collectionId].executeRequest(req, res);
//     // })
//     ;
//     return collectionsRouter;
// };
// // // First, does the collection exist?
// // const result = await repo.get(collectionId);
// // if(!result){
// //   return res.status(404);
// // }
// // // Second, determine the absolute path
// // const startOfPathToRemove = '/' + collectionId + "/index";
// // const relativePath = req.path.substring(startOfPathToRemove.length);
// // const absoluatePath = path.join(result.rootDirectory, relativePath);
// // // handle the path
// // const pathType = await fileSystem.pathType(absoluatePath);
// // if(pathType === FileSystemObjectType.NotFound){
// //   return res.status(404);
// // }
// // if(pathType === FileSystemObjectType.File) {
// //   return res.download(absoluatePath);
// // }
// // if(pathType === FileSystemObjectType.Directory) {
// //   const originalUrl = req.headers["_originsRequestUrl"] as string | undefined;
// //   // Hypermedia including paths to thumbnails and webdav
// // }

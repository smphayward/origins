"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIndexRouter = void 0;
const url_join_ts_1 = require("url-join-ts");
const DocumentRouterFactory_1 = require("../documents/DocumentRouterFactory");
const models_1 = require("./models");
const createIndexRouter = (indexProvider) => {
    return (0, DocumentRouterFactory_1.createDocumentRouter)(indexProvider).onFormatDocument((document, context) => {
        const documentId = document[models_1.IndexRecordFields.id];
        if (!documentId) {
            return document;
        }
        let links = {
            thumb: {
                _href: (0, url_join_ts_1.urlJoin)(context.requestUrlWithoutPath, "thumbnails", documentId + ".jpg"),
            },
            self: {
                _ref: (0, url_join_ts_1.urlJoin)(context.requestUrlWithoutPath, "index", documentId),
            }
        };
        const collectionId = document[models_1.IndexRecordFields.collectionId];
        const relativePath = document[models_1.IndexRecordFields.fileRelativePath];
        if (collectionId && relativePath) {
            links.webdav = {
                _href: (0, url_join_ts_1.urlJoin)(context.requestUrlWithoutPath, "webdav", document.collectionId, encodeURI(relativePath)),
            };
        }
        document._links = links;
        return document;
    });
};
exports.createIndexRouter = createIndexRouter;
// export const createIndexRouter = (
//   collectionProvider: CollectionProvider
// ): Router => {
//   const indexRouter = express.Router();
//   indexRouter
//     .get("/", async (req, res) => {
//       // Start reading all documents in the collection
//     })
//     .get("/:documentId", async (req, res) => {
//       const documentId = req.params.documentId;
//       // Read the specified document
//     })
//     .put("/:documentId", async (req, res) => {
//       const documentId = req.params.documentId;
//       // Write the specified document
//     })
//     .delete("/:documentId", async (req, res) => {
//       const documentId = req.params.documentId;
//       // Delete the specified document
//     })
//     .get("/search", async (req, res) => {
//       // Results need to have links to thumbnails and webdav originals
//     });
//   return indexRouter;
// };

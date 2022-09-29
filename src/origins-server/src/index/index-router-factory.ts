import { urlJoin } from "url-join-ts";
import express, { Router } from "express";
import { createDocumentRouter } from "../documents/DocumentRouterFactory";
import { IndexProvider } from "./IndexProvider";
import { IndexRecordFields } from "./models";

export const createIndexRouter = (indexProvider: IndexProvider) => {
  return createDocumentRouter(indexProvider).onFormatDocument(
    (document: any, context) => {
      const documentId = document[IndexRecordFields.id] as string | null;
      if (!documentId) {
        return document;
      }
      let links: any = {
        thumb: {
          _href: urlJoin(context.requestUrlWithoutPath, "api", "thumbnails", documentId + ".jpg"),
        },
        self: {
          _ref: urlJoin(context.requestUrlWithoutPath, "api","index", documentId),
        }
      };
      const collectionId = document[IndexRecordFields.collectionId] as
        | string
        | null;
      const relativePath = document[IndexRecordFields.fileRelativePath] as
        | string
        | null;
      if (collectionId && relativePath) {
        links.webdav = {
          _href: urlJoin(
            context.requestUrlWithoutPath,
            "api",
            "webdav",
            document.collectionId,
            encodeURI(relativePath)
          ),
        };
      }
      document._links = links;
      return document;
    }
  );
}


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

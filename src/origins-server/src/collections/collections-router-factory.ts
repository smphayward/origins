import express, { Router } from "express";
import { v2 as webdav } from "webdav-server";
import { createDocumentRouter } from "../documents/DocumentRouterFactory";
import { QueryStringParser } from "../documents/QueryStringParser";
import { WebDAVServerFactory } from "../web-dav/web-dav-server-factory";
import * as fsSync from "fs";
import {
  Collection,
  CollectionInfo,
  CollectionProvider,
} from "origins-common/collections";
import { ProcessingProvider } from "../processing/ProcessingProvider";

// TODO: Put in PBI for origins-agent to have HTTP API that takes submission of manual jobs
// great for testing

export const createCollectionsRouter = (
  collectionProvider: CollectionProvider,
  queryStringParser: QueryStringParser,
  processingProvider: ProcessingProvider
) => {
  return createDocumentRouter(collectionProvider, queryStringParser, [])
    .onFormatDocument((document: Collection, context) => {
      // TODO: Hyperlinks

      const formattedDocument: CollectionInfo = {
        ...document,
        rootDirectoryExists: fsSync.existsSync(document.rootDirectory),
      };

      return formattedDocument;
    })
    .router()
    .post("/:id/process", async (req, res) => {
      const documentId = req.params.id as string;
      const result = await collectionProvider.get(documentId);
      if (!result.success || !result.document) {
        return res.status(404).send({
          success: false,
          statusCode: 404,
          message: `Could not process collection with id ${documentId}. Collection not found.`,
        });
      }

      try {
        await processingProvider.processPath(result.document, "", -1);
        return res.status(200).send({
          success: true,
          statusCode: 200,
          message: "Processing succeeded.",
        });
      } catch (error) {
        return res.status(500).send({
          success: false,
          statusCode: 500,
          message: `Processing failed. ${JSON.stringify(error)}`,
        });
      }
    });
};

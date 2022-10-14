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

// TODO: Put in PBI for origins-agent to have HTTP API that takes submission of manual jobs
// great for testing

export const createCollectionsRouter = (
  collectionProvider: CollectionProvider,
  queryStringParser: QueryStringParser
) => {
  return createDocumentRouter(
    collectionProvider,
    queryStringParser,
    []
  ).onFormatDocument((document: Collection, context) => {
    // TODO: Hyperlinks

    const formattedDocument: CollectionInfo = {
      ...document,
      rootDirectoryExists: fsSync.existsSync(document.rootDirectory),
    };

    return formattedDocument;
  });
};

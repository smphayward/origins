import express, { Router } from "express";
import { v2 as webdav } from "webdav-server";
import { createDocumentRouter } from "../documents/DocumentRouterFactory";
import { QueryStringParser } from "../documents/QueryStringParser";
import { WebDAVServerFactory } from "../web-dav/web-dav-server-factory";
import { ItemProvider } from "origins-common/items";
import { Item, ItemInfo } from "origins-common/items";
import * as fsSync from "fs";
import { urlJoin } from "url-join-ts";
import { ItemHyperlinkUtil } from "./ItemHyperlinkUtil";

export const createItemsRouter = (
  provider: ItemProvider,
  queryStringParser: QueryStringParser
) => {
  return createDocumentRouter(
    provider,
    queryStringParser,
    []
  ).onFormatDocument((item: Item, context) => {
    let formattedDocument: ItemInfo = {
      ... item,
      _links: {
        thumb: ItemHyperlinkUtil.getThumbnailHref(item),
        self: ItemHyperlinkUtil.getItemHref(item),
        webdav: ItemHyperlinkUtil.getWebDavHref(item)
      }
    };
    return formattedDocument;
  }).router();
};
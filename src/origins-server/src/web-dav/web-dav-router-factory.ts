import { v2 as webdav } from 'webdav-server'
import express from "express";
import { WebDAVServerFactory } from './web-dav-server-factory';
import { CollectionProvider } from 'origins-common/collections';

export const createWebDAVRouter = (
  collectionProvider: CollectionProvider
) => {

  const router = express.Router();

  const webDAVServers: { [collectionId: string]: webdav.WebDAVServer } = {};

  router

    // ===== WEBDAV ===== //
    .all(['/:id/*', '/:id'], async (req, res) => {

      const collectionId = req.params.id;

      console.log(`Received WebDAV request for collection '${collectionId}'.`);

      // First, does the collection exist?
      const result = await collectionProvider.get(collectionId);
      if (!result.success || !result.document) {
        return res.status(404).send(`Collection '${collectionId}' not found.`);
      }

      // Second, does the webDAVServer object exist?
      webDAVServers[collectionId] =
        webDAVServers[collectionId] ??
        WebDAVServerFactory(`/webdav/${collectionId}/`, result.document.rootDirectory);

      // // Third, strip the url
      // const urlPortionToStrip = "/" + collectionId;
      // req.url = req.url.substring(urlPortionToStrip.length);
      // console.log(`passing '${req.url}' to webdav`);
      
      // Third, expand the url with whatever is missing
      req.url = '/webdav' + req.url;
      console.log(`passing '${req.url}' to webdav`);

      // Finally, do the things!
      webDAVServers[collectionId].executeRequest(req, res);
    });

    return router;

  //rootDirectory: string




  // // ----- Build the WebDAV Server ----- //
  // const webDAVServer = WebDAVServerFactory(rootDirectory);

  // // ----- Express Router ----- //
  // const fileSystemRouter = express.Router();

  // fileSystemRouter.all("*", (req, res) => {
  //  console.log("webdav-server", req.url);
  //  //req.url = "/";
  //  webDAVServer.executeRequest(req, res);
  // })

  // // ----- All Done ----- //
  // return fileSystemRouter;

}
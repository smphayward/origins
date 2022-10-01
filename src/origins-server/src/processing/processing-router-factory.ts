import express, { Router } from "express";
import * as path from 'path';
import { CollectionProvider } from "../collections/CollectionProvider";
import { ProcessingProvider } from "./ProcessingProvider";



export const createProcessingRouter = (
  collectionProvider: CollectionProvider,
  processingProvider: ProcessingProvider
): Router => {
  const router = express.Router();

  router
    .post(['/:collectionId/*', '/:collectionId'], async (req, res) => {

      const collectionId = req.params.collectionId;

      console.log(`Received processing request for collection '${collectionId}'.`);

      // First, does the collection exist?
      const result = await collectionProvider.get(collectionId);
      if (!result) {
        return res.status(404).send(`Collection '${collectionId}' not found.`);
      }

      // Second, strip the url
      const urlPortionToStrip = "/" + collectionId;
      const relativePath = req.url.substring(urlPortionToStrip.length);

      // Third, make the processing request
      console.log(`Processing '${relativePath}' in collection '${collectionId}'.`);
      const decodedRelativePath = decodeURI(relativePath);
      await processingProvider.processPath(result, decodedRelativePath, -1); // TODO: get depth from header
      console.log('Processing completed.');

      return res.status(200).send("Processing completed.");

      // TODO: Put this in a queue and offload it to a worker process?
      // For now, we'll just do it in process with blocking


    })


  return router;

}
import express, { Router } from "express";
import { Document } from "./models";
import { DocumentProvider } from "./DocumentProvider";
import { QueryStringParser } from "./QueryStringParser";

export interface RequestContext {
  requestUrlWithoutPath: string;
  requestUrl: string;
}



export const createDocumentRouter = <TDocument extends Document>(
  documentProvider: DocumentProvider<TDocument>,
  queryStringParser: QueryStringParser
) => {
  const router = express.Router();

  // Callbacks
  type onFormatDocumentFn = (document: TDocument, context: RequestContext) => object;
  let onFormatDocumentInstance: onFormatDocumentFn =  (d) => d;
  class createDocumentRouterReturn {
    public onFormatDocument(callback: (document: TDocument, context: RequestContext) => object) {
      onFormatDocumentInstance = callback;
      return this;
    }

    // TODO: Other callbacks, as they make sense
    // onGetAll(), onPut(), etc.

    public router() {
      return router;
    }
  }

  // Document Formatting
  const formatDocuments = (documents: TDocument[], req: express.Request):object[] => {
    let formattedDocuments: object[] | null = null;
    const context: RequestContext = {
      requestUrlWithoutPath: req.headers[
        "_originsRequestUrlWithoutPath"
      ] as string,
      requestUrl: req.headers["_originsRequestUrl"] as string,
    };
    formattedDocuments = documents.map((d) =>
      onFormatDocumentInstance(d, context)
    );
    return formattedDocuments;
  }

  

  // Setup the Routes
  router
    .get("/", async (req, res) => {

      const qs = queryStringParser.parseGetMany(req);

      const result = await documentProvider.getAll(qs.maxResults, qs.continuationToken);

      const final = {
        continuationToken: result.continuationToken,
        documents: formatDocuments(result.documents, req)
      }
      return res.send(final);

    })
    .get("/search", async (req, res) => {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).send("Parameter 'q' not specified.");
      }
      // Get the documents
      const result = await documentProvider.search(query);
      // Format documents
      const final = {
        continuationToken: result.continuationToken,
        documents: formatDocuments(result.documents, req)
      }
      // All done
      return res.status(200).send(final);
    })
    .get("/:id", async (req, res) => {
      const documentId = req.params.id as string;
      const result = await documentProvider.get(documentId);
      if (!result) {
        return res.status(404).send("Not found.");
      }
      return res.send(result);
    })
    .put("/:id", async (req, res) => {
      const documentId = req.params.id;
      const document = req.body as TDocument;
      if (!document) {
        return res
          .status(400)
          .send("Body is blank or is not in the right format.");
      }
      if (document.id != documentId) {
        return res
          .status(400)
          .send(
            `id property ${document.id} in body does not match id '${documentId}' in URL path.`
          );
      }
      // TODO: Detect whether it was created or modified
      const result = await documentProvider.put(document);
      return res.send(document);
    })
    .delete("/:id", async (req, res) => {
      const documentId = req.params.id;
      const result = await documentProvider.delete(documentId);
      if (!result) {
        return res.status(404).send("Not found.");
      }
      return res.status(200).send("Success");
    });

  return new createDocumentRouterReturn();

};

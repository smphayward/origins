import express, { Router } from "express";
import { DocumentProvider, DocumentSortCondition, GeneralResponse, OriginsDocument, UpsertDocumentResponse } from 'origins-common';
//import { Document } from "../_boneyard/models";
//import { DocumentProvider, DocumentSortCondition } from "./DocumentProvider";
import { QueryStringParser } from "./QueryStringParser";

export interface RequestContext {
  requestUrlWithoutPath: string;
  requestUrl: string;
}

export const createDocumentRouter = <TDocument extends OriginsDocument>(
  documentProvider: DocumentProvider<TDocument>,
  queryStringParser: QueryStringParser,
  defaultSort: DocumentSortCondition[]
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

  // Request Context
  const getRequestContext = (req: express.Request): RequestContext => {
    return {
      requestUrlWithoutPath: req.headers[
        "_originsRequestUrlWithoutPath"
      ] as string,
      requestUrl: req.headers["_originsRequestUrl"] as string,
    };
  }

  // Document Formatting
  const formatDocuments = (documents: TDocument[] | undefined, req: express.Request):object[] | undefined => {
    if(documents === undefined){
      return undefined;
    }
    const context = getRequestContext(req);
    return documents.map((d) =>
      onFormatDocumentInstance(d, context)
    );
  }
  const formatDocument = (document: TDocument | undefined, req: express.Request): object | undefined => {
    if(document === undefined){
      return undefined;
    }
    const context = getRequestContext(req);
    return onFormatDocumentInstance(document, context);
  }

  

  // Setup the Routes
  router
    .get("/", async (req, res) => {

      const qs = queryStringParser.parseGetMany(req);

      const result = await documentProvider.getAll(
        qs.maxResults,
        qs.continuationToken,
        defaultSort
      );

      return res.status(result.statusCode).send({
        ...result,
        documents: formatDocuments(result.documents, req),
      });

    })
    .get("/search", async (req, res) => {
      
      const qs = queryStringParser.parseSearch(req);
      if(!qs.query){
        return res.status(400).send(<GeneralResponse>{
          success: false,
          statusCode: 400,
          message: "Parameter 'q' not specified."
        });
      }

      // Get the documents
      const result = await documentProvider.search(
        qs.query,
        qs.maxResults,
        qs.continuationToken,
        defaultSort
      );

      // Format and return
      return res.status(result.statusCode).send({
        ...result,
        documents: formatDocuments(result.documents, req),
      });
    })
    .get("/:id", async (req, res) => {
      const documentId = req.params.id as string;
      const result = await documentProvider.get(documentId);
      return res.status(result.statusCode).send({
        ...result,
        document: formatDocument(result.document, req)
      });
    })
    .put("/:id", async (req, res) => {
      const documentId = req.params.id;
      const document = req.body as TDocument;
      if (!document) {
        return res
          .status(400)
          .send(<UpsertDocumentResponse<TDocument>>{
            success: false,
            statusCode: 400,
            message: "Body is blank or is not in the right format."
          });
      }
      if (document.id != documentId) {
        return res
          .status(400)
          .send(<UpsertDocumentResponse<TDocument>>{
            success: false,
            statusCode: 400,
            message: `id property ${document.id} in body does not match id '${documentId}' in URL path.`
          });
      }
      const result = await documentProvider.put(document);
      return res.status(result.statusCode).send({
        ...result,
        document: formatDocument(result.document, req)
      });
    })
    .delete("/:id", async (req, res) => {
      const documentId = req.params.id;
      const result = await documentProvider.delete(documentId);
      return res.status(result.statusCode).send(result);
    })
    .post("/purge", async (req, res) => {

      const qs = queryStringParser.parsePurge(req);

      const result = await documentProvider.purge(qs.query);
      return res.status(result.statusCode).send(result);
    })
    
    ;

  return new createDocumentRouterReturn();

};

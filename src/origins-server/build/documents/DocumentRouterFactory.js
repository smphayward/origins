"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocumentRouter = void 0;
const express_1 = __importDefault(require("express"));
const createDocumentRouter = (documentProvider) => {
    const router = express_1.default.Router();
    let onFormatDocumentInstance = (d) => d;
    class createDocumentRouterReturn {
        onFormatDocument(callback) {
            onFormatDocumentInstance = callback;
            return this;
        }
        // TODO: Other callbacks, as they make sense
        // onGetAll(), onPut(), etc.
        router() {
            return router;
        }
    }
    // Document Formatting
    const formatDocuments = (documents, req) => {
        let formattedDocuments = null;
        const context = {
            requestUrlWithoutPath: req.headers["_originsRequestUrlWithoutPath"],
            requestUrl: req.headers["_originsRequestUrl"],
        };
        formattedDocuments = documents.map((d) => onFormatDocumentInstance(d, context));
        return formattedDocuments;
    };
    // Setup the Routes
    router
        .get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const documents = yield documentProvider.getAll();
        const formattedDocuments = formatDocuments(documents, req);
        return res.send(formattedDocuments);
    }))
        .get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const query = req.query.q;
        if (!query) {
            return res.status(400).send("Parameter 'q' not specified.");
        }
        // Get the documents
        const documents = yield documentProvider.search(query);
        // Format documents
        const formattedDocuments = formatDocuments(documents, req);
        // All done
        return res.status(200).send(formattedDocuments);
    }))
        .get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const documentId = req.params.id;
        const result = yield documentProvider.get(documentId);
        if (!result) {
            return res.status(404).send("Not found.");
        }
        return res.send(result);
    }))
        .put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const documentId = req.params.id;
        const document = req.body;
        if (!document) {
            return res
                .status(400)
                .send("Body is blank or is not in the right format.");
        }
        if (document.id != documentId) {
            return res
                .status(400)
                .send(`id property ${document.id} in body does not match id '${documentId}' in URL path.`);
        }
        // TODO: Detect whether it was created or modified
        const result = yield documentProvider.put(document);
        return res.send(document);
    }))
        .delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const documentId = req.params.id;
        const result = yield documentProvider.delete(documentId);
        if (!result) {
            return res.status(404).send("Not found.");
        }
        return res.status(200).send("Success");
    }));
    return new createDocumentRouterReturn();
};
exports.createDocumentRouter = createDocumentRouter;

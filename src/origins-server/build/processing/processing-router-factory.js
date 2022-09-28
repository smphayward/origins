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
exports.createProcessingRouter = void 0;
const express_1 = __importDefault(require("express"));
const createProcessingRouter = (collectionProvider, processingProvider) => {
    const router = express_1.default.Router();
    router
        .post(['/:collectionId/*', '/:collectionId'], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const collectionId = req.params.collectionId;
        console.log(`Received processing request for collection '${collectionId}'.`);
        // First, does the collection exist?
        const result = yield collectionProvider.get(collectionId);
        if (!result) {
            return res.status(404).send(`Collection '${collectionId}' not found.`);
        }
        // Second, strip the url
        const urlPortionToStrip = "/" + collectionId;
        const relativePath = req.url.substring(urlPortionToStrip.length);
        // Third, make the processing request
        console.log(`Processing '${relativePath}' in collection '${collectionId}'.`);
        const decodedRelativePath = decodeURI(relativePath);
        yield processingProvider.processPath(result, decodedRelativePath, -1); // TODO: get depth from header
        console.log('Processing finished.');
        return res.status(200).send("Processing succeeded.");
        // TODO: Put this in a queue and offload it to a worker process?
        // For now, we'll just do it in process with blocking
    }));
    return router;
};
exports.createProcessingRouter = createProcessingRouter;

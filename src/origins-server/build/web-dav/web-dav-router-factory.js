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
exports.createWebDAVRouter = void 0;
const express_1 = __importDefault(require("express"));
const web_dav_server_factory_1 = require("./web-dav-server-factory");
const createWebDAVRouter = (collectionProvider) => {
    const router = express_1.default.Router();
    const webDAVServers = {};
    router
        // ===== WEBDAV ===== //
        .all(['/:id/*', '/:id'], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const collectionId = req.params.id;
        console.log(`Received WebDAV request for collection '${collectionId}'.`);
        // First, does the collection exist?
        const result = yield collectionProvider.get(collectionId);
        if (!result) {
            return res.status(404).send(`Collection '${collectionId}' not found.`);
        }
        // Second, does the webDAVServer object exist?
        webDAVServers[collectionId] =
            (_a = webDAVServers[collectionId]) !== null && _a !== void 0 ? _a : (0, web_dav_server_factory_1.WebDAVServerFactory)(`/webdav/${collectionId}/`, result.rootDirectory);
        // // Third, strip the url
        // const urlPortionToStrip = "/" + collectionId;
        // req.url = req.url.substring(urlPortionToStrip.length);
        // console.log(`passing '${req.url}' to webdav`);
        // Third, expand the url with whatever is missing
        req.url = '/webdav' + req.url;
        console.log(`passing '${req.url}' to webdav`);
        // Finally, do the things!
        webDAVServers[collectionId].executeRequest(req, res);
    }));
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
};
exports.createWebDAVRouter = createWebDAVRouter;

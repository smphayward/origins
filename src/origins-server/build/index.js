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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const winston_1 = __importDefault(require("winston"));
const express_winston_1 = __importDefault(require("express-winston"));
const body_parser_1 = __importDefault(require("body-parser"));
const collections_router_factory_1 = require("./collections/collections-router-factory");
const index_router_factory_1 = require("./index/index-router-factory");
const ElasticsearchCollectionProvider_1 = require("./collections/ElasticsearchCollectionProvider");
const web_dav_router_factory_1 = require("./web-dav/web-dav-router-factory");
const ElasticsearchIndexProvider_1 = require("./index/ElasticsearchIndexProvider");
const processing_router_factory_1 = require("./processing/processing-router-factory");
const ProcessingProvider_1 = require("./processing/ProcessingProvider");
const ThumbnailProvider_1 = require("./thumbnails/ThumbnailProvider");
const AggregateExtractionProvider_1 = require("./extraction/AggregateExtractionProvider");
const FileInfoExtractionProvider_1 = require("./extraction/FileInfoExtractionProvider");
const ProbeImageSizeExtractionProvider_1 = require("./extraction/ProbeImageSizeExtractionProvider");
const KeywordExtractionProvider_1 = require("./extraction/KeywordExtractionProvider");
const thumbnail_router_factory_1 = require("./thumbnails/thumbnail-router-factory");
// Configuration
const port = 8080;
const elasticsearchClientOptions = {
    node: "http://192.168.2.160:9200",
};
// Providers & repositories
const collectionProvider = new ElasticsearchCollectionProvider_1.ElasticsearchCollectionProvider({
    indexName: "origins_collections",
    elasticsearchClientOptions,
});
const indexProvider = new ElasticsearchIndexProvider_1.ElasticsearchIndexProvider({
    indexName: "origins_index",
    elasticsearchClientOptions,
});
const extractionProvider = new AggregateExtractionProvider_1.AggregateExtractionProvider(new FileInfoExtractionProvider_1.FileInfoExtractionProvider(), 
// new RegExPathExtractor(pathExtractorConfig),
new KeywordExtractionProvider_1.KeywordExtractionProvider({
    // REALLY need aliasing feature
    // Scrapfest --> Scrapbooking (for activity)
    // Magic The Gathering --> MTG (might need regex stuff for this...)
    // Maybe each thing that gets found could add other things
    // -- Find "31 Aberdeen", also add "Brampton"
    // Need to try cataloging everything and then see what kinds of needs there are
    person: [
        "Justyn",
        "Joshua",
        "Julia",
        "Monica",
        "Shaun",
        "Hayward",
        "Allan",
        "Dominic",
        "Bert",
        "Albert",
        "Francis",
        "Walker",
        "Gallant",
        "Glisinski",
        "Dennis",
        "Ruth",
    ],
    place: [
        "Beaverton",
        "Picton",
        "Brampton",
        "29 Spring",
        "563 Mara",
        "31 Aberdeen",
    ],
}), new ProbeImageSizeExtractionProvider_1.ProbeImageSizeExtractionProvider());
const thumbnailProvider = new ThumbnailProvider_1.ThumbnailProvider({
    rootThumbnailDirectory: "/home/shaun/repos/origins/origins-test-folders/thumbnails",
}, indexProvider);
const processingProvider = new ProcessingProvider_1.ProcessingProvider(extractionProvider, indexProvider, thumbnailProvider);
// Setup Database
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Ensuring elasticsearch indexes exist");
    yield collectionProvider.ensureIndexExists();
    yield indexProvider.ensureIndexExists();
}))();
// Express
const app = (0, express_1.default)();
// CORS - TODO: MAKE THIS CONFIGURABLE
app.use((0, cors_1.default)());
// Logging
//more options here - https://github.com/bithavoc/express-winston#request-logging
app.use(express_winston_1.default.logger({
    transports: [
        new winston_1.default.transports.Console()
    ],
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
    meta: false,
    msg: "HTTP  ",
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) { return false; }
}));
// Parsing
//app.use(bodyParser.urlencoded({ extended: false }))
app.use(body_parser_1.default.json());
// Middleware
app.use(function (req, res, next) {
    const originsRequestUrlWithoutPath = `${req.protocol}://${req.hostname}:${port}`;
    req.headers["_originsRequestUrlWithoutPath"] = originsRequestUrlWithoutPath;
    req.headers["_originsRequestUrl"] = `${originsRequestUrlWithoutPath}${req.originalUrl}`;
    return next();
});
// UI
app.get("/", (req, res) => {
    res.send("Hello, world!");
});
// API
app.use("/collections", (0, collections_router_factory_1.createCollectionsRouter)(collectionProvider).router());
app.use("/index", (0, index_router_factory_1.createIndexRouter)(indexProvider).router());
app.use("/processing", (0, processing_router_factory_1.createProcessingRouter)(collectionProvider, processingProvider));
app.use("/webdav", (0, web_dav_router_factory_1.createWebDAVRouter)(collectionProvider));
app.use("/thumbnails", (0, thumbnail_router_factory_1.createThumbnailRouter)(thumbnailProvider));
// app.use("/index", createIndexRouter(databaseProvider));
// app.use("/search", createSearchRouter(databaseProvider));
// Start listening
app.listen(port, () => {
    console.log(`Origins REST API server started at http://localhost:${port}`);
});

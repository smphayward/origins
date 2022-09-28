import express from "express";
import cors from 'cors'

import winston from 'winston';
import expressWinston from 'express-winston';

import bodyParser from "body-parser";
import { ClientOptions } from "@elastic/elasticsearch";
import { createCollectionsRouter } from "./collections/collections-router-factory";

import { createIndexRouter } from "./index/index-router-factory";
import { ElasticsearchCollectionProvider } from "./collections/ElasticsearchCollectionProvider";
import { createWebDAVRouter } from "./web-dav/web-dav-router-factory";

import { ElasticsearchIndexProvider } from "./index/ElasticsearchIndexProvider";
import { createProcessingRouter } from "./processing/processing-router-factory";
import { ProcessingProvider } from "./processing/ProcessingProvider";
import { ThumbnailProvider } from "./thumbnails/ThumbnailProvider";
import { AggregateExtractionProvider } from "./extraction/AggregateExtractionProvider";
import { FileInfoExtractionProvider } from "./extraction/FileInfoExtractionProvider";
import { ProbeImageSizeExtractionProvider } from "./extraction/ProbeImageSizeExtractionProvider";
import { KeywordExtractionProvider } from "./extraction/KeywordExtractionProvider";
import { createThumbnailRouter } from "./thumbnails/thumbnail-router-factory";

// Configuration
const port = 8080;
const elasticsearchClientOptions: ClientOptions = {
  node: "http://192.168.2.160:9200",
};

// Providers & repositories
const collectionProvider = new ElasticsearchCollectionProvider({
  indexName: "origins_collections",
  elasticsearchClientOptions,
});

const indexProvider = new ElasticsearchIndexProvider({
  indexName: "origins_index",
  elasticsearchClientOptions,
});

const extractionProvider = new AggregateExtractionProvider(
  new FileInfoExtractionProvider(),
  // new RegExPathExtractor(pathExtractorConfig),
  new KeywordExtractionProvider({
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
  }),
  new ProbeImageSizeExtractionProvider()
);

const thumbnailProvider = new ThumbnailProvider(
  {
    rootThumbnailDirectory:
      "/home/shaun/repos/origins/origins-test-folders/thumbnails",
  },
  indexProvider
);

const processingProvider = new ProcessingProvider(
  extractionProvider,
  indexProvider,
  thumbnailProvider
);

// Setup Database
(async () => {
  console.log("Ensuring elasticsearch indexes exist");
  await collectionProvider.ensureIndexExists();
  await indexProvider.ensureIndexExists();
})();

// Express
const app = express();

// CORS - TODO: MAKE THIS CONFIGURABLE
app.use(cors());

// Logging
//more options here - https://github.com/bithavoc/express-winston#request-logging
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  meta: false,
  msg: "HTTP  ",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) { return false; }
}));

// Parsing
//app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// Middleware
app.use(function (req, res, next) {
  const originsRequestUrlWithoutPath = `${req.protocol}://${req.hostname}:${port}`;
  req.headers[
    "_originsRequestUrlWithoutPath"
  ] = originsRequestUrlWithoutPath;
  req.headers[
    "_originsRequestUrl"
  ] = `${originsRequestUrlWithoutPath}${req.originalUrl}`;
  return next();
});

// UI
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// API
app.use("/collections", createCollectionsRouter(collectionProvider).router());
app.use("/index", createIndexRouter(indexProvider).router());
app.use(
  "/processing",
  createProcessingRouter(collectionProvider, processingProvider)
);
app.use("/webdav", createWebDAVRouter(collectionProvider));
app.use("/thumbnails", createThumbnailRouter(thumbnailProvider));
// app.use("/index", createIndexRouter(databaseProvider));
// app.use("/search", createSearchRouter(databaseProvider));

// Start listening
app.listen(port, () => {
  console.log(`Origins REST API server started at http://localhost:${port}`);
});

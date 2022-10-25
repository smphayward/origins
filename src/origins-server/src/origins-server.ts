import express from "express";
import cors from "cors";

import winston from "winston";
import expressWinston from "express-winston";

import bodyParser from "body-parser";
import { ClientOptions } from "@elastic/elasticsearch";
import { createCollectionsRouter } from "./collections/collections-router-factory";

import { ElasticsearchCollectionProvider } from "./collections/ElasticsearchCollectionProvider";
import { createWebDAVRouter } from "./web-dav/web-dav-router-factory";

import { ThumbnailProvider } from "./thumbnails/ThumbnailProvider";
import { AggregateExtractionProvider } from "./extraction/AggregateExtractionProvider";
import { FileInfoExtractionProvider } from "./extraction/FileInfoExtractionProvider";
import { ProbeImageSizeExtractionProvider } from "./extraction/ProbeImageSizeExtractionProvider";
import { KeywordExtractionProvider } from "./extraction/KeywordExtractionProvider";
import { createThumbnailRouter } from "./thumbnails/thumbnail-router-factory";
import chalk from "chalk";
import { getConfig } from "./config/ConfigFactory";
import { createHealthRouter } from "./health/health-router-factory";
import { QueryStringParser } from "./documents/QueryStringParser";
import { createItemsRouter } from "./items/items-router-factory";
import { ElasticsearchItemProvider } from "./items/ElasticsearchItemProvider";
import { createProcessingRouter } from "./processing/processing-router-factory";
import { ProcessingProvider } from "./processing/ProcessingProvider";

console.log(
  chalk.blue(`

 ██████  ██████  ██  ██████  ██ ███    ██ ███████ 
██    ██ ██   ██ ██ ██       ██ ████   ██ ██      
██    ██ ██████  ██ ██   ███ ██ ██ ██  ██ ███████ 
██    ██ ██   ██ ██ ██    ██ ██ ██  ██ ██      ██ 
 ██████  ██   ██ ██  ██████  ██ ██   ████ ███████ 

`)
);

//  ██████  ██████  ███    ██ ███████ ██  ██████
// ██      ██    ██ ████   ██ ██      ██ ██
// ██      ██    ██ ██ ██  ██ █████   ██ ██   ███
// ██      ██    ██ ██  ██ ██ ██      ██ ██    ██
//  ██████  ██████  ██   ████ ██      ██  ██████

const config = getConfig();

// Not using loop for this because we might include passwords at some point
// Only specific things should be output.

console.log();
console.log("--- Configuration ---");
console.log();
console.log(
  chalk.white("Server port:   ") + chalk.cyanBright(config.server.port)
);
console.log(
  chalk.white("UI Dir:        ") + chalk.cyanBright(config.uiDirectory)
);
console.log(
  chalk.white("Thumbnail Dir: ") + chalk.cyanBright(config.thumbnailsDirectory)
);
console.log(
  chalk.white("Placeholder:   ") +
    chalk.cyanBright(config.fileNotFoundPlaceholder)
);
console.log(
  chalk.white("ES Host:       ") + chalk.cyanBright(config.elasticsearch.host)
);
console.log(
  chalk.white("Collections:   ") +
    chalk.cyanBright(JSON.stringify(config.collections))
);

console.log();

// ██████  ███████ ██████  ███████ ███    ██ ██████  ███████ ███    ██  ██████ ██ ███████ ███████
// ██   ██ ██      ██   ██ ██      ████   ██ ██   ██ ██      ████   ██ ██      ██ ██      ██
// ██   ██ █████   ██████  █████   ██ ██  ██ ██   ██ █████   ██ ██  ██ ██      ██ █████   ███████
// ██   ██ ██      ██      ██      ██  ██ ██ ██   ██ ██      ██  ██ ██ ██      ██ ██           ██
// ██████  ███████ ██      ███████ ██   ████ ██████  ███████ ██   ████  ██████ ██ ███████ ███████

console.log();
console.log("--- Dependencies ---");
console.log();

console.log("Setting up dependencies...");

const elasticsearchClientOptions: ClientOptions = {
  node: config.elasticsearch.host,
};

const collectionProvider = new ElasticsearchCollectionProvider({
  indexName: `${config.elasticsearch.indexPrefix}origins_collections`,
  elasticsearchClientOptions,
});

// const indexProvider = new ElasticsearchIndexProvider({
//   indexName: "origins_index",
//   elasticsearchClientOptions,
// });

const itemProvider = new ElasticsearchItemProvider({
  indexName: `${config.elasticsearch.indexPrefix}origins_items`,
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
    rootThumbnailDirectory: config.thumbnailsDirectory,
    imageNotFoundPlaceholderFile: config.fileNotFoundPlaceholder,
  },
  itemProvider
);

const processingProvider = new ProcessingProvider(
  config,
  extractionProvider,
  itemProvider,
  thumbnailProvider
);

const queryStringParser = new QueryStringParser();

// Setup Database
console.log("Setting up database...");
const setupDatabasePromise = (async () => {
  try {
    console.log("Ensuring collection provider index exist...");
    await collectionProvider.ensureIndexExists();
    console.log("Collection provider index exists.");
  } catch (error) {
    console.log(chalk.red("Error!"));
    console.log(error);
  }

  try {
    console.log("Ensuring item provider index exist...");
    await itemProvider.ensureIndexExists();
    console.log("Item provider index exists.");
  } catch (error) {
    console.log(chalk.red("Error!"));
    console.log(error);
  }

  const configCollectionIds = Object.keys(config.collections);
  if (configCollectionIds.length > 0) {
    console.log("Configuration includes collections. Ensuring they exist...");
    configCollectionIds.forEach(async (id) => {
      const collection = config.collections[id];
      try {
        console.log(`Putting collection '${id}'`);
        await collectionProvider.put(collection);
        console.log(`Finished putting collection '${id}'`);
      } catch (error) {
        console.log(chalk.red("Error!"));
        console.log(error);
      }
    });
  }
})();

// ██   ██ ████████ ████████ ██████
// ██   ██    ██       ██    ██   ██
// ███████    ██       ██    ██████
// ██   ██    ██       ██    ██
// ██   ██    ██       ██    ██

console.log("Setting up HTTP...");

// Express
const app = express();

// CORS - TODO: MAKE THIS CONFIGURABLE
app.use(cors());

// Logging
//more options here - https://github.com/bithavoc/express-winston#request-logging
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
    meta: false,
    msg: "HTTP  ",
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) {
      return false;
    },
  })
);

// Parsing
app.use(bodyParser.json());

// Middleware
app.use(function (req, res, next) {
  const originsRequestUrlWithoutPath = `${req.protocol}://${req.hostname}:${config.server.port}`;
  req.headers["_originsRequestUrlWithoutPath"] = originsRequestUrlWithoutPath;
  req.headers[
    "_originsRequestUrl"
  ] = `${originsRequestUrlWithoutPath}${req.originalUrl}`;
  return next();
});

// Health
app.use("/health", createHealthRouter());

// API
app.use(
  "/api/collections",
  createCollectionsRouter(
    collectionProvider,
    queryStringParser,
    processingProvider
  )
);
app.use(
  "/api/items",
  createItemsRouter(itemProvider, queryStringParser)
);

//app.use("/api/index", createIndexRouter(indexProvider, queryStringParser).router());
app.use(
  "/api/processing",
  createProcessingRouter(collectionProvider, processingProvider)
);
app.use("/api/webdav", createWebDAVRouter(collectionProvider));
app.use("/api/thumbnails", createThumbnailRouter(thumbnailProvider));
// app.use("/index", createIndexRouter(databaseProvider));
// app.use("/search", createSearchRouter(databaseProvider));

// UI
app.use(express.static(config.uiDirectory));
app.use("/assets", express.static("./assets/"));

// Start listening
console.log("Starting Origins server...");
app.listen(config.server.port, () => {
  console.log(
    `Origins server started at http://localhost:${config.server.port}`
  );
});

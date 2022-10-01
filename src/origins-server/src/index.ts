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
import chalk from 'chalk';

import commandLineArgs from 'command-line-args';
import { ManagerNotFound } from "webdav-server";

console.log(chalk.blue(`

 ██████  ██████  ██  ██████  ██ ███    ██ ███████ 
██    ██ ██   ██ ██ ██       ██ ████   ██ ██      
██    ██ ██████  ██ ██   ███ ██ ██ ██  ██ ███████ 
██    ██ ██   ██ ██ ██    ██ ██ ██  ██ ██      ██ 
 ██████  ██   ██ ██  ██████  ██ ██   ████ ███████ 

`));

//  ██████  ██████  ███    ██ ███████ ██  ██████  
// ██      ██    ██ ████   ██ ██      ██ ██       
// ██      ██    ██ ██ ██  ██ █████   ██ ██   ███ 
// ██      ██    ██ ██  ██ ██ ██      ██ ██    ██ 
//  ██████  ██████  ██   ████ ██      ██  ██████  

const defaultElasticsearchHost = process.env['ELASTICSEARCH_HOSTS'] ?? 'http://localhost:9200';

console.log('Reading command line arguments...');
console.log();
const optionDefinitions = [
  { name: 'ui-dir', type: String, defaultValue: './ui/' },
  { name: 'thumbnails-dir', type: String, defaultValue: './thumbnails/' },
  { name: 'port', type: Number, defaultValue: 8080 },
  { name: 'not-found-placeholder', type: String, defaultValue: './assets/image-not-found.jpg' },
  { name: 'elasticsearch-host', type: String, defaultValue: defaultElasticsearchHost}
];

const options = commandLineArgs(optionDefinitions);

// Not using loop for this because we might include passwords at some point
console.log(chalk.white('ui-dir: ') + options['ui-dir']);
console.log(chalk.white('thumbnails-dir: ') + options['thumbnails-dir']);
console.log(chalk.white('port: ') + options['port']);
console.log(chalk.white('not-found-placeholder: ') + options['not-found-placeholder']);
console.log(chalk.white('elasticsearch-host: ') + options['elasticsearch-host']);

console.log();


// ██████  ███████ ██████  ███████ ███    ██ ██████  ███████ ███    ██  ██████ ██ ███████ ███████ 
// ██   ██ ██      ██   ██ ██      ████   ██ ██   ██ ██      ████   ██ ██      ██ ██      ██      
// ██   ██ █████   ██████  █████   ██ ██  ██ ██   ██ █████   ██ ██  ██ ██      ██ █████   ███████ 
// ██   ██ ██      ██      ██      ██  ██ ██ ██   ██ ██      ██  ██ ██ ██      ██ ██           ██ 
// ██████  ███████ ██      ███████ ██   ████ ██████  ███████ ██   ████  ██████ ██ ███████ ███████ 

console.log('Setting up dependencies...');

const elasticsearchClientOptions: ClientOptions = {
  node: options['elasticsearch-host'],
};

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
    rootThumbnailDirectory: options['thumbnails-dir'],
    imageNotFoundPlaceholderFile: options['not-found-placeholder']
  },
  indexProvider
);

const processingProvider = new ProcessingProvider(
  extractionProvider,
  indexProvider,
  thumbnailProvider
);

// Setup Database
console.log('Setting up database...');
const setupDatabasePromise = (async () => {
  console.log("Ensuring collection provider index exist...");
  try {
    await collectionProvider.ensureIndexExists();
    console.log("Collection provider index exists.")
  } catch (error) {
    console.log(chalk.red('Error!'));
    console.log(error);
  }

  console.log("Ensuring index provider index exist...");
  try {
    await indexProvider.ensureIndexExists();
    console.log("Index provider index exists.")
  } catch (error) {
    console.log(chalk.red('Error!'));
    console.log(error);
  }
})();

// ██   ██ ████████ ████████ ██████  
// ██   ██    ██       ██    ██   ██ 
// ███████    ██       ██    ██████  
// ██   ██    ██       ██    ██      
// ██   ██    ██       ██    ██      

console.log('Setting up HTTP...');

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
app.use(bodyParser.json());

// Middleware
app.use(function (req, res, next) {
  const originsRequestUrlWithoutPath = `${req.protocol}://${req.hostname}:${options.port}`;
  req.headers[
    "_originsRequestUrlWithoutPath"
  ] = originsRequestUrlWithoutPath;
  req.headers[
    "_originsRequestUrl"
  ] = `${originsRequestUrlWithoutPath}${req.originalUrl}`;
  return next();
});

// API
app.use("/api/collections", createCollectionsRouter(collectionProvider).router());
app.use("/api/index", createIndexRouter(indexProvider).router());
app.use(
  "/api/processing",
  createProcessingRouter(collectionProvider, processingProvider)
);
app.use("/api/webdav", createWebDAVRouter(collectionProvider));
app.use("/api/thumbnails", createThumbnailRouter(thumbnailProvider));
// app.use("/index", createIndexRouter(databaseProvider));
// app.use("/search", createSearchRouter(databaseProvider));

// UI
app.use(express.static(options['ui-dir']));

// Start listening
console.log("Starting Origins server...");
app.listen(options.port, () => {
  console.log(`Origins server started at http://localhost:${options.port}`);
});

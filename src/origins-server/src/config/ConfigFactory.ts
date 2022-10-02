import commandLineArgs from "command-line-args";
import chalk from "chalk";
import { CollectionDictionary } from "../collections/models";

interface ServerConfig {
  port: number;
}

interface FileExtensions {
  image: string[]
}

interface ElasticsearchConfig {
  host: string;
}

export interface Config {
  
  // Server
  server: ServerConfig;

  // Files Directories
  uiDirectory: string;
  thumbnailsDirectory: string;
  fileNotFoundPlaceholder: string;

  // File Extensions
  fileExtensions: FileExtensions;
  

  // Elasticsearch
  elasticsearch: ElasticsearchConfig;

  // Collections to ensure exist on startup
  collections: CollectionDictionary;

}

export const defaultConfig: Config = {
  // Server
  server: {
    port: 8080,
  },

  // Files Directories
  uiDirectory: "./ui/",
  thumbnailsDirectory: "./thumbnails/",
  fileNotFoundPlaceholder: "./assets/image-not-found.jpg",

  fileExtensions: {
    image: [ ".jpg", ".png", ".gif" ],
  },

  // Elasticsearch
  elasticsearch: {
    host: "http://192.168.2.226:9200" //"http://localhost:9200",
  },

  // Collections
  collections: {},
};

const numberOrUndefined = (value: string | undefined): number | undefined => {
  if (!value) {
    return undefined;
  }
  return Number(value);
};

const getConfigFromCommandLineArgs = () => {
  const optionDefinitions = [
    // Server
    { name: "server-port", type: Number },

    // Files and Directories
    { name: "dir-ui", type: String },
    { name: "dir-thumbnails", type: String },
    { name: "file-not-found-placeholder", type: String },

    // Elasticsearch
    { name: "elasticsearch-host", type: String },
  ];

  const options = commandLineArgs(optionDefinitions);

  return {
    // Server
    server: {
      port: numberOrUndefined(options["server-port"]),
    },

    // Files & Directories
    uiDirectory: options["dir-ui"],
    thumbnailsDirectory: options["dir-thumbnails"],
    fileNotFoundPlaceholder: options["file-not-found-placeholder"],

    // Elasticsearch
    elasticsearch: {
      host: options["elasticsearch-host"],
    },

    // Collections
    collections: <CollectionDictionary>{},
  };
};

const getConfigFromEnvironmentVariables = () => {
  const collectionPrefix = 'COLLECTION_';

  const collections = Object.keys(process.env)
    .filter(
      (k) =>
        k.startsWith(collectionPrefix) &&
        k.length > collectionPrefix.length &&
        process.env[k]
    )
    .reduce((prev, cur) => {
      const id = cur.substring(collectionPrefix.length);
      const rootDirectory = process.env[cur];
      if (!rootDirectory) {
        return prev;
      }
      prev[id] = { id, rootDirectory };
      return prev;
    }, <CollectionDictionary>{});

  return {
    // Hosting
    server: {
      port: numberOrUndefined(process.env["SVR_PORT"]),
    },

    // Files & Directories
    uiDirectory: process.env["DIR_UI"],
    thumbnailsDirectory: process.env["DIR_THUMBNAILS"],
    fileNotFoundPlaceholder: process.env["FILE_NOT_FOUND_PLACEHOLDER"],

    // Elasticsearch
    elasticsearch: {
      host: process.env["ELASTICSEARCH_HOSTS"],
    },

    // Collections
    collections,
  };
};

export const getConfig = (): Config => {
  // Prefer command-line args
  const cla = getConfigFromCommandLineArgs();

  // Then prefer environment variables
  const env = getConfigFromEnvironmentVariables();

  // TODO: Then prefer .yaml file

  // Then prefer default

  return {
    // Server
    server: {
      port: cla.server.port ?? env.server.port ?? defaultConfig.server.port,
    },

    // Files Directories
    uiDirectory:
      cla.uiDirectory ?? env.uiDirectory ?? defaultConfig.uiDirectory,
    thumbnailsDirectory:
      cla.thumbnailsDirectory ??
      env.thumbnailsDirectory ??
      defaultConfig.thumbnailsDirectory,
    fileNotFoundPlaceholder:
      cla.fileNotFoundPlaceholder ??
      env.fileNotFoundPlaceholder ??
      defaultConfig.fileNotFoundPlaceholder,

    // Extensions
    fileExtensions: defaultConfig.fileExtensions,

    // Elasticsearch
    elasticsearch: {
      host:
        cla.elasticsearch.host ??
        env.elasticsearch.host ??
        defaultConfig.elasticsearch.host,
    },

    collections: { ...env.collections, ...cla.collections },
  };

  // const defaultElasticsearchHost = process.env['ELASTICSEARCH_HOSTS'] ?? 'http://localhost:9200';

  // console.log('Reading command line arguments...');
  // console.log();
  // const optionDefinitions = [
  //   { name: 'ui-dir', type: String, defaultValue: './ui/' },
  //   { name: 'thumbnails-dir', type: String, defaultValue: './thumbnails/' },
  //   { name: 'port', type: Number, defaultValue: 8080 },
  //   { name: 'not-found-placeholder', type: String, defaultValue: './assets/image-not-found.jpg' },
  //   { name: 'elasticsearch-host', type: String, defaultValue: defaultElasticsearchHost}
  // ];

  // const options = commandLineArgs(optionDefinitions);
};

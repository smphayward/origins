"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.ThumbnailProvider = void 0;
const jimp_1 = __importDefault(require("jimp"));
const path = __importStar(require("path"));
const fsSync = __importStar(require("fs"));
const models_1 = require("../index/models");
class ThumbnailProvider {
    constructor(config, indexProvider) {
        this._config = config;
        this._indexProvider = indexProvider;
    }
    GenerateThumbnail(indexRecordId, regenerateIfExists, sourceAbsolutePath) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Generating thumbnail for '${indexRecordId}'.`);
            // Make sure we have the source path
            if (!sourceAbsolutePath) {
                const indexResponse = yield this._indexProvider.get(indexRecordId);
                if (!indexResponse) {
                    throw new Error('sourceAbsolutePath not specified and could not find index record for item.');
                }
                sourceAbsolutePath = indexResponse[models_1.IndexRecordFields.fileAbsolutePath];
                if (!sourceAbsolutePath) {
                    throw new Error('fileAbsolutePath property does not exist on index record');
                }
            }
            // Determine the destination path
            const destinationAbsolutePath = path.join(this._config.rootThumbnailDirectory, indexRecordId + ".jpg");
            // Short-circuit if exists and we shouldn't regenerate
            if (!regenerateIfExists && fsSync.existsSync(destinationAbsolutePath)) {
                return destinationAbsolutePath;
            }
            let error = null;
            const promise = jimp_1.default.read(sourceAbsolutePath)
                .then((image) => {
                let width = image.getWidth();
                let height = image.getHeight();
                if (width > height) {
                    width = 500;
                    height = jimp_1.default.AUTO;
                }
                else {
                    height = 500;
                    width = jimp_1.default.AUTO;
                }
                image.bitmap.exifBuffer = undefined;
                return image
                    .resize(width, height)
                    .quality(60)
                    .write(destinationAbsolutePath, (writeErr) => {
                    error = writeErr;
                });
            })
                .catch((err) => {
                error = err;
            });
            yield Promise.all([promise]);
            if (error) {
                throw error;
            }
            return destinationAbsolutePath;
        });
    }
}
exports.ThumbnailProvider = ThumbnailProvider;
//   private readonly _fileSystemProvider: FileSystemProvider;
//   private readonly _config: ThumbnailManagerConfig;
//   constructor(
//     databaseProvider: ElasticsearchDatabaseProvider,
//     fileSystemProvider: FileSystemProvider,
//     config: ThumbnailManagerConfig
//   ) {
//     this._databaseProvider = databaseProvider;
//     this._fileSystemProvider = fileSystemProvider;
//     this._config = config;
//   }
//   public async GenerateThumbnail(
//     documentId: string,
//     regenerateIfExists: boolean): Promise<string | null>  {
//       const thumbPath = this.ResolveThumbnailPath(documentId);
//       const thumbPathType = await this._fileSystemProvider.pathType(thumbPath);
//       if(thumbPathType === FileSystemObjectType.Directory) {
//         throw new Error(`Cannot generate thumbnail. Path '${thumbPath}' already exists as a directory.`);
//       }
//       // Generate the thumbnail if needed
//       if(regenerateIfExists || thumbPathType === FileSystemObjectType.NotFound) {
//         // Get the document from database
//         // Get the absolute path
//         // Generate a thumbnail
//       }
//       return thumbPath;
//   }
//   // Connection to Database
//   // Folder where thumbnails go
//   // ----- Private Helpers ----- //
//   private ResolveThumbnailPath(documentId: string): string {
//     if(documentId.trim().length === 0) {
//       throw new Error("Cannot resolve thumbnail path. documentId is empty.");
//     }
//     return path.join(this._config.rootThumbnailDirectory, documentId + '.jpg');
//   }
// }

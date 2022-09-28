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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessingProvider = void 0;
const crypto = __importStar(require("crypto"));
const path = __importStar(require("path"));
const fs_1 = require("fs");
const PathTypeUtil_1 = require("../file-system/PathTypeUtil");
class ProcessingProvider {
    constructor(extractionProvider, indexProvider, thumbnailProvider) {
        this._extractionProvider = extractionProvider;
        this._indexProvider = indexProvider;
        this._thumbnailProvider = thumbnailProvider;
    }
    processPath(collection, relativePath, // Relative to the collection's path
    depth) {
        return __awaiter(this, void 0, void 0, function* () {
            // Normalize the relative path to always start with /
            if (!relativePath.startsWith('/')) {
                relativePath = '/' + relativePath;
            }
            // Make sure depth is an integer
            depth = Math.trunc(depth);
            const absolutePath = path.join(collection.rootDirectory, relativePath);
            const pathType = yield (0, PathTypeUtil_1.getPathType)(absolutePath);
            if (pathType === PathTypeUtil_1.FileSystemObjectType.NotFound) {
                throw new Error("Not found!");
            }
            if (pathType === PathTypeUtil_1.FileSystemObjectType.File) {
                yield this.processFile(collection, relativePath, absolutePath);
            }
            if (pathType === PathTypeUtil_1.FileSystemObjectType.Directory) {
                yield this.processDirectory(collection, absolutePath, depth);
            }
        });
    }
    // ----- HELPER METHODS ----- //
    processFile(collection, relativePath, // Relative to the collection's path
    absolutePath) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Processing file: ${absolutePath}`);
            // Normalize the relative path to always start with /
            // This is important when making the id
            if (!relativePath.startsWith('/')) {
                relativePath = '/' + relativePath;
            }
            // Extract information
            const extractedData = yield this._extractionProvider.extract(absolutePath, {
                collectionId: collection.id,
                collectionDirectory: collection.rootDirectory,
                relativeFilePath: relativePath,
            });
            // Create index record
            const preHashId = `${collection.id}${relativePath.trimStart()}`;
            const indexRecord = {
                id: crypto.createHash("sha256").update(preHashId).digest("base64url"),
            };
            // Add extracted information
            for (const prop in extractedData) {
                indexRecord[prop] = extractedData[prop];
            }
            // Push the index record
            yield this._indexProvider.put(indexRecord);
            // Generate thumbnail
            yield this._thumbnailProvider.GenerateThumbnail(indexRecord.id, true, absolutePath);
        });
    }
    processDirectory(collection, 
    //relativePath: string,
    absolutePath, depth) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Processing directory: ${absolutePath}`);
            try {
                const children = yield fs_1.promises.readdir(absolutePath, {
                    withFileTypes: true,
                });
                for (const i in children) {
                    const child = children[i];
                    const childAbsolutePath = path.join(absolutePath, child.name);
                    if (child.isFile()) {
                        // Relative to the collection's root
                        const relativePath = childAbsolutePath.substring(collection.rootDirectory.length);
                        yield this.processFile(collection, relativePath, childAbsolutePath);
                    }
                    else if (child.isDirectory() && depth !== 0) { // This is indentionally !== 0. If someone specifies -1 then depth is infinite.
                        yield this.processDirectory(collection, childAbsolutePath, depth--);
                    }
                }
            }
            catch (err) {
                console.log("Failed to read directory.");
                console.log(err);
            }
        });
    }
}
exports.ProcessingProvider = ProcessingProvider;

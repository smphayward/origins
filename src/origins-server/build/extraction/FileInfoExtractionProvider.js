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
exports.FileInfoExtractionProvider = void 0;
const fs_1 = require("fs");
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
class FileInfoExtractionProvider {
    constructor() {
    }
    extract(filePath, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let metadata = {};
            // Info that can help later on
            metadata["collectionId"] = context.collectionId;
            metadata["collectionDirectory"] = context.collectionDirectory;
            metadata["fileRelativePath"] = context.relativeFilePath;
            metadata["fileAbsolutePath"] = filePath;
            // General file info
            const stats = yield fs_1.promises.stat(filePath);
            metadata["fileSizeBytes"] = stats.size;
            metadata["fileCreated"] = stats.birthtime;
            metadata["fileModified"] = stats.mtime;
            // File path info
            const parsedPath = path.parse(filePath);
            metadata["filename"] = parsedPath.name;
            metadata["fileExtension"] = parsedPath.ext;
            // ===== Hash for the unique identifier ===== //
            // This hashing method might not be perfect
            // Hopefully, though, it will help detect both duplicates and files that move
            // More ideal would be getting a checksum from the file itself
            // However, this would cause performance to suffer greatly with large quantities of files
            // Perhaps this will be an optional thing in the future to improve accuracy at the expense of speed
            // Perhaps that will be a separate hash function. Named this function accordingly.
            const hashable = parsedPath.name +
                parsedPath.ext +
                stats.size +
                stats.birthtime.toISOString();
            // Perhaps this should also be configurable
            // sha256 is somewhat slower but is much less likely to result in a collision
            // sha512 is even slower but even less likely to result in a collision
            // This is almost certainly academic when it comes to a dinky little photo database
            metadata["fileInfoHash"] = crypto.createHash("sha256").update(hashable).digest("base64url");
            // metadata["fileInfoHash"] = await this._fileHasher.generateFileInfoHash(
            //   filePath
            // );
            return metadata;
        });
    }
}
exports.FileInfoExtractionProvider = FileInfoExtractionProvider;

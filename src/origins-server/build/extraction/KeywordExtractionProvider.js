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
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeywordExtractionProvider = void 0;
class KeywordExtractionProvider {
    constructor(config) {
        this._config = config;
    }
    extract(filePath, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let extractedData = {};
            // Strip root directory
            if (filePath.startsWith(context.collectionDirectory)) {
                filePath = filePath.substring(context.collectionDirectory.length);
            }
            for (const metadataName in this._config) {
                const keywords = this._config[metadataName];
                const matchingKeywords = keywords.filter((kw) => filePath.toLowerCase().includes(kw.toLowerCase()));
                if (matchingKeywords) {
                    extractedData[metadataName] = matchingKeywords;
                }
            }
            return extractedData;
        });
    }
}
exports.KeywordExtractionProvider = KeywordExtractionProvider;

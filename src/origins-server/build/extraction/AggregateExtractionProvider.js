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
exports.AggregateExtractionProvider = void 0;
class AggregateExtractionProvider {
    constructor(...params) {
        this._extractionProviders = params;
    }
    extract(filePath, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let extractedData = {};
            for (let i = 0; i < this._extractionProviders.length; i++) {
                const ep = this._extractionProviders[i];
                const newExtractedData = yield ep.extract(filePath, context);
                for (const prop in newExtractedData) {
                    if (!extractedData[prop]) {
                        extractedData[prop] = newExtractedData[prop];
                    }
                }
            }
            return extractedData;
        });
    }
}
exports.AggregateExtractionProvider = AggregateExtractionProvider;

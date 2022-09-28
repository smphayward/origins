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
exports.ElasticsearchDocumentProvider = void 0;
const elasticsearch_1 = require("@elastic/elasticsearch");
class ElasticsearchDocumentProvider {
    constructor(config) {
        this._idPrefix = ""; // Left over from some ideas I previously had
        this._config = config;
        this._client = new elasticsearch_1.Client(config.elasticsearchClientOptions);
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.searchInternal({
                prefix: {
                    id: {
                        value: this._idPrefix,
                    },
                },
            });
        });
    }
    get(id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._client.get({
                    index: this._config.indexName,
                    id: this.getElasticsearchId(id),
                });
                return (_a = response._source) !== null && _a !== void 0 ? _a : null;
            }
            catch (error) {
                if (error instanceof elasticsearch_1.errors.ResponseError && error.statusCode === 404) {
                    return null;
                }
                throw error;
            }
        });
    }
    put(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._client.update({
                    index: this._config.indexName,
                    id: this.getElasticsearchId(collection.id),
                    doc: collection,
                    doc_as_upsert: true,
                });
                return collection;
                // const response = await this._client.index<Collection>({
                //   index: this._config.indexName,
                //   id: this.getElasticsearchId(collection.id),
                //   document: collection,
                // });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._client.delete({
                    index: this._config.indexName,
                    id: this.getElasticsearchId(id),
                });
                return true;
            }
            catch (error) {
                if (error instanceof elasticsearch_1.errors.ResponseError && error.statusCode === 404) {
                    return false;
                }
                throw error;
            }
        });
    }
    search(lucene) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.searchInternal({
                query_string: {
                    query: lucene,
                },
            });
        });
    }
    // ----- Non-interface members ----- //
    ensureIndexExists() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const exists = yield this._client.indices.exists({
                    index: this._config.indexName
                });
                if (exists)
                    return;
                yield this._client.indices.create({
                    index: this._config.indexName,
                });
            }
            catch (error) {
                if (error instanceof elasticsearch_1.errors.ResponseError &&
                    error.body.error.type === "resource_already_exists_exception") {
                    console.log(`Index '${this._config.indexName}' already exists.`);
                    return;
                }
                console.log("Re-throwing error from ensureIndexExists()");
                throw error;
            }
        });
    }
    // ----- HELPERS ----- //
    getElasticsearchId(id) {
        return this._idPrefix + id;
    }
    searchInternal(query) {
        return __awaiter(this, void 0, void 0, function* () {
            // Where starts with _idPrefix
            const response = yield this._client.search({
                index: this._config.indexName,
                query,
                size: 1000, // TODO: Support continuations
            });
            return response.hits.hits
                .map((h) => h._source)
                .filter((c) => c)
                .map(c => c);
        });
    }
}
exports.ElasticsearchDocumentProvider = ElasticsearchDocumentProvider;

//import { Client, ClientOptions, errors } from "@elastic/elasticsearch";
import { ElasticsearchDocumentProvider } from "../documents/ElasticsearchDocumentProvider";
import { CollectionProvider } from "./CollectionProvider";
import { Collection } from "./models";

export class ElasticsearchCollectionProvider
  extends ElasticsearchDocumentProvider<Collection>
  implements CollectionProvider {


  // private readonly _idPrefix = "";
  // private readonly _config: ElasticSearchCollectionRepositoryConfig;
  // private readonly _client: Client;
  // constructor(config: ElasticSearchCollectionRepositoryConfig) {
  //   this._config = config;
  //   this._client = new Client(config.elasticsearchClientOptions);
  // }
  // public async getAll(): Promise<Collection[]> {
  //   // Where starts with _idPrefix
  //   const response = await this._client.search<Collection>({
  //     index: this._config.indexName,
  //     query: {
  //       prefix: {
  //         id: {
  //           value: this._idPrefix,
  //         },
  //       },
  //     },
  //     size: 1000, // TODO: Support continuations
  //   });
  //   return response.hits.hits
  //     .map((h) => h._source)
  //     .filter((c) => c) as Collection[];
  // }
  // public async get(id: string): Promise<Collection | null> {
  //   try {
  //     const response = await this._client.get<Collection>({
  //       index: this._config.indexName,
  //       id: this.getElasticsearchId(id),
  //     });
  //     return response._source ?? null;
  //   } catch (error) {
  //     if (error instanceof errors.ResponseError && error.statusCode === 404) {
  //       return null;
  //     }
  //     throw error;
  //   }
  // }
  // public async put(collection: Collection): Promise<Collection> {
  //   try {
  //     this._client.update<Collection>({
  //       index: this._config.indexName,
  //       id: this.getElasticsearchId(collection.id),
  //       doc: collection,
  //       doc_as_upsert: true,
  //     });
  //     return collection;
  //     // const response = await this._client.index<Collection>({
  //     //   index: this._config.indexName,
  //     //   id: this.getElasticsearchId(collection.id),
  //     //   document: collection,
  //     // });
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // }
  // public async delete(id: string): Promise<boolean> {
  //   try {
  //     const response = await this._client.delete({
  //       index: this._config.indexName,
  //       id: this.getElasticsearchId(id),
  //     });
  //     return true;
  //   } catch (error) {
  //     if (error instanceof errors.ResponseError && error.statusCode === 404) {
  //       return false;
  //     }
  //     throw error;
  //   }
  // }
  // // ----- Non-interface members ----- //
  // public async ensureIndexExists(): Promise<void> {
  //   try {
  //     await this._client.indices.create({
  //       index: this._config.indexName,
  //     });
  //   } catch (error) {
  //     if (
  //       error instanceof errors.ResponseError &&
  //       error.body.error.type === "resource_already_exists_exception"
  //     ) {
  //       console.log(`Index '${this._config.indexName}' already exists.`);
  //       return;
  //     }
  //     throw error;
  //   }
  // }
  // // ----- HELPERS ----- //
  // private getElasticsearchId(id: string) {
  //   return this._idPrefix + id;
  // }
}

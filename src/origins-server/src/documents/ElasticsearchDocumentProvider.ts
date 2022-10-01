import { Client, ClientOptions, errors, estypes } from "@elastic/elasticsearch";
import { Document } from "./Document";
import { DocumentProvider } from "./DocumentProvider";

export interface ElasticsearchDocumentProviderConfig {
  indexName: string;
  elasticsearchClientOptions: ClientOptions;
}

export class ElasticsearchDocumentProvider<TDocument extends Document>
  implements DocumentProvider<TDocument>
{
  private readonly _idPrefix = ""; // Left over from some ideas I previously had
  private readonly _config: ElasticsearchDocumentProviderConfig;
  private readonly _client: Client;

  constructor(config: ElasticsearchDocumentProviderConfig) {
    this._config = config;
    this._client = new Client(config.elasticsearchClientOptions);
  }

  public async getAll(): Promise<TDocument[]> {
    return await this.searchInternal({
      prefix: {
        id: {
          value: this._idPrefix,
        },
      },
    });

  }

  public async get(id: string): Promise<TDocument | null> {
    try {
      const response = await this._client.get<TDocument>({
        index: this._config.indexName,
        id: this.getElasticsearchId(id),
      });
      return response._source ?? null;
    } catch (error) {
      if (error instanceof errors.ResponseError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  public async put(collection: TDocument): Promise<TDocument> {
    try {
      this._client.update<TDocument>({
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
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      const response = await this._client.delete({
        index: this._config.indexName,
        id: this.getElasticsearchId(id),
      });
      return true;
    } catch (error) {
      if (error instanceof errors.ResponseError && error.statusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  public async search(lucene: string): Promise<TDocument[]> {
    return await this.searchInternal({
      query_string: {
        query: lucene,
      },
    });
  }

  // ----- Non-interface members ----- //
  public async ensureIndexExists(): Promise<void> {
    try {
      const exists = await this._client.indices.exists({
        index: this._config.indexName
      });
      if(exists) {
        console.log(`Index '${this._config.indexName}' already exists.`);
        return;
      }
      await this._client.indices.create({
        index: this._config.indexName,
      });
      console.log(`Index '${this._config.indexName}' created.`);
    } catch (error) {
      if (
        error instanceof errors.ResponseError &&
        error.body.error.type === "resource_already_exists_exception"
      ) {
        console.log(`Index '${this._config.indexName}' already exists.`);
        return;
      }
      console.log("Re-throwing error from ensureIndexExists()");
      throw error;
    }
  }

  // ----- HELPERS ----- //
  private getElasticsearchId(id: string) {
    return this._idPrefix + id;
  }

  private async searchInternal(
    query: estypes.QueryDslQueryContainer
  ): Promise<TDocument[]> {
    // Where starts with _idPrefix
    const response = await this._client.search<TDocument>({
      index: this._config.indexName,
      query,
      size: 1000, // TODO: Support continuations
    });
    return response.hits.hits
      .map((h) => h._source)
      .filter((c) => c)
      .map(c => c)  as TDocument[];
  }
}

import { Client, ClientOptions, errors, estypes } from "@elastic/elasticsearch";
import { Document, MultipleDocumentsResult } from "./models";
import { DocumentProvider, DocumentSortCondition } from "./DocumentProvider";
import base64Url from 'base64url';
import { SortResults } from "@elastic/elasticsearch/lib/api/types";

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

  public async getAll(
    maxResults: number = 25,
    continuationToken: string | null = null,
    sort: DocumentSortCondition[] = []
  ): Promise<MultipleDocumentsResult< TDocument>> {
    console.log(`Getting up to '${maxResults}' results with continuation token '${continuationToken}'.`);
    return await this.searchInternal(
      {
        prefix: {
          id: {
            value: this._idPrefix,
          },
        },
      },
      sort,
      maxResults,
      continuationToken
    );
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

  public async search(
    lucene: string,
    maxResults: number = 25,
    continuationToken: string | null = null,
    sort: DocumentSortCondition[] = []
  ): Promise<MultipleDocumentsResult< TDocument>> {
    console.log(`Searching up to '${maxResults}' results with continuation token '${continuationToken}'.`);
    return await this.searchInternal({
      query_string: {
        query: lucene,
      },
    },
    sort,
    maxResults,
    continuationToken);
  }

  // ----- Non-interface members ----- //
  public async ensureIndexExists(): Promise<void> {
    try {
      const exists = await this._client.indices.exists({
        index: this._config.indexName,
      });
      if (exists) {
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
    query: estypes.QueryDslQueryContainer,
    sort: DocumentSortCondition[] = [],
    maxResults: number = 25,
    continuationToken: string | null = null
  ): Promise<MultipleDocumentsResult< TDocument>> {
    // Where starts with _idPrefix
    const response = await this._client.search<TDocument>({
      index: this._config.indexName,

      query,
      sort: [
        // {_uid: "asc" },
        //{ _uid: {"order" : "asc" , "missing" : "_last" , "unmapped_type" :"string"} }
        { _score: { order: "desc" } },
        ...sort.map(sort => ({ [sort.field]: { order: sort.order }}))

        // Replace this with a date/time stamp stored as an integer
        //{ fileSizeBytes: { order: "asc" } },
        // { "@timestamp" : "desc" },
        //{ "_uid": {"order" : "asc" , "missing" : "_last" , "unmapped_type" :"string"} }
      ],
      size: maxResults, 
      search_after: this.parseContinuationToken(continuationToken),
    });

    // TODO: Make TDocument include _links and add the link to "get more" here, if possible
    // Though maybe not in this class but rather in DocumentRouterFactory
    const newContinuationToken = this.createContinuationToken(response);
    console.log(`continuation token: ${newContinuationToken}`);

    const documents = response.hits.hits
      .map((h) => h._source)
      .filter((c) => c)
      .map((c) => c) as TDocument[];

      return {
        documents,
        continuationToken: newContinuationToken
      }
  }

  private createContinuationToken(
    response: estypes.SearchResponse<
      TDocument,
      Record<string, estypes.AggregationsAggregate>
    >
  ): string | undefined {
    const sort = response?.hits?.hits[response?.hits?.hits?.length - 1]?.sort;
    if (sort) {
      return base64Url.encode(JSON.stringify(sort));
    }
    return undefined;
  }

  private parseContinuationToken(
    continuationToken: string | undefined | null
  ): SortResults | undefined {
    if (!continuationToken) {
      return undefined;
    }
    return JSON.parse(base64Url.decode(continuationToken)) as SortResults;
  }
}

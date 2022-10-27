import { Client, ClientOptions, errors, estypes } from "@elastic/elasticsearch";
import { DocumentProvider, DocumentSortCondition, GeneralResponse, PurgeDocumentsResponse } from "origins-common";
import base64Url from "base64url";
import { SortResults } from "@elastic/elasticsearch/lib/api/types";
import {
  OriginsDocument,
  DeleteDocumentResponse,
  GetDocumentsResponse,
  UpsertDocumentResponse,
  ResponseFactory,
  GetDocumentResponse,
  DocumentResponse
} from "origins-common";
import { Collection } from "origins-common/collections";

export interface ElasticsearchDocumentProviderConfig {
  indexName: string;
  elasticsearchClientOptions: ClientOptions;
}

export class ElasticsearchDocumentProvider<TDocument extends OriginsDocument>
  implements DocumentProvider<TDocument, TDocument>
{
  private readonly _idPrefix = ""; // Left over from some ideas I previously had

  private readonly _client: Client;
  private readonly _responseFactory: ResponseFactory<TDocument>;

  constructor(private readonly _config: ElasticsearchDocumentProviderConfig) {
    this._client = new Client(_config.elasticsearchClientOptions);
    this._responseFactory = new ResponseFactory<TDocument>();
  }

  public async getAll(
    maxResults: number = 25,
    continuationToken: string | null = null,
    sort: DocumentSortCondition[] = []
  ): Promise<GetDocumentsResponse<TDocument>> {
    console.log(
      `Getting up to '${maxResults}' results with continuation token '${continuationToken}'.`
    );
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

  public async get(id: string): Promise<GetDocumentResponse<TDocument>> {
    try {
      const response = await this._client.get<TDocument>({
        index: this._config.indexName,
        id: this.getElasticsearchId(id),
      });
      if (!response.found || !response._source) {
        return this._responseFactory.getDocument.notFound();
      }
      return this._responseFactory.getDocument.ok(response._source);
    } catch (error) {
      return this.errorToGeneralResponse(error);
    }
  }

  public async put(
    document: TDocument
  ): Promise<UpsertDocumentResponse<TDocument>> {
    try {
      const response = this._client.update<TDocument>({
        index: this._config.indexName,
        id: this.getElasticsearchId(document.id),
        doc: document,
        doc_as_upsert: true,
      });
      return this._responseFactory.upsertDocument.ok(document);
    } catch (error) {
      return this.errorToGeneralResponse(error);
    }
  }

  public async delete(id: string): Promise<DeleteDocumentResponse> {
    try {
      const response = await this._client.delete({
        index: this._config.indexName,
        id: this.getElasticsearchId(id),
      });
      return this._responseFactory.deleteDocument.ok();
    } catch (error) {
      return this.errorToGeneralResponse(error);
    }
  }

  public async search(
    lucene: string,
    maxResults: number = 25,
    continuationToken: string | null = null,
    sort: DocumentSortCondition[] = []
  ): Promise<GetDocumentsResponse<TDocument>> {
    console.log(
      `Searching up to '${maxResults}' results with continuation token '${continuationToken}'.`
    );
    return await this.searchInternal(
      {
        query_string: {
          query: lucene,
        },
      },
      sort,
      maxResults,
      continuationToken
    );
  }

  // ██████  ██    ██ ██████   ██████  ███████
  // ██   ██ ██    ██ ██   ██ ██       ██
  // ██████  ██    ██ ██████  ██   ███ █████
  // ██      ██    ██ ██   ██ ██    ██ ██
  // ██       ██████  ██   ██  ██████  ███████

  public async purge(lucene?: string): Promise<PurgeDocumentsResponse> {
    console.log(`Purging ${lucene ?? 'all'}`);
    try {
      const response = await this._client.deleteByQuery({
        index: this._config.indexName,
        query: this.luceneToQuery(lucene),
      });
      return this._responseFactory.purgeDocuments.ok(response.deleted);
    } catch (error) {
      console.log(`Error purging: ${error}`)
      return this.errorToGeneralResponse(error);
    }
  }

  // ███████ ██   ██ ████████ ██████   █████  ███████
  // ██       ██ ██     ██    ██   ██ ██   ██ ██
  // █████     ███      ██    ██████  ███████ ███████
  // ██       ██ ██     ██    ██   ██ ██   ██      ██
  // ███████ ██   ██    ██    ██   ██ ██   ██ ███████

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

  // ██   ██ ███████ ██      ██████  ███████ ██████  ███████
  // ██   ██ ██      ██      ██   ██ ██      ██   ██ ██
  // ███████ █████   ██      ██████  █████   ██████  ███████
  // ██   ██ ██      ██      ██      ██      ██   ██      ██
  // ██   ██ ███████ ███████ ██      ███████ ██   ██ ███████

  private getElasticsearchId(id: string) {
    return this._idPrefix + id;
  }

  private errorToGeneralResponse(error: any): GeneralResponse {
    if (error instanceof errors.ResponseError) {
      if (error.statusCode === 404) {
        return this._responseFactory.document.notFound();
      }
      return this._responseFactory.document.custom(
        false,
        error.statusCode ?? 500,
        error.message
      );
    }
    return this._responseFactory.document.internalServerError(
      JSON.stringify(error)
    );
  }


  private luceneToQuery(lucene?: string): estypes.QueryDslQueryContainer {
    if (!lucene || lucene.trim().length === 0) {
      return {
        match_all: {},
      };
    }
    return {
      query_string: {
        query: lucene,
      },
    };
  }

  private async searchInternal(
    query: estypes.QueryDslQueryContainer,
    sort: DocumentSortCondition[] = [],
    maxResults: number = 25,
    continuationToken: string | null = null
  ): Promise<GetDocumentsResponse<TDocument>> {
    console.log("Searching internal", {
      query,
      sort,
      maxResults,
      continuationToken
    });
    try {
      const response = await this._client.search<TDocument>({
        index: this._config.indexName,
        query,
        sort: [
          { _score: { order: "desc" } },
          ...sort.map((sort) => ({ [sort.field]: { order: sort.order } })),
        ],
        size: maxResults,
        search_after: this.parseContinuationToken(continuationToken),
      });
  
      // TODO: Make TDocument include _links and add the link to "get more" here, if possible
      // Though maybe not in this class but rather in DocumentRouterFactory
      const newContinuationToken = this.createContinuationToken(response);
      console.log(`new continuation token: ${newContinuationToken}`);
  
      const documents = response.hits.hits
        .map((h) => h._source)
        .filter((c) => c)
        .map((c) => c) as TDocument[];
  
      return this._responseFactory.getDocuments.ok(
        documents,
        newContinuationToken
      );
    } catch (error) {
      return this.errorToGeneralResponse(error);
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
    console.log('no sort from elasticsearch so no continuation token.');
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

//import { Client, ClientOptions, errors } from "@elastic/elasticsearch";
import { Collection } from "origins-common/collections";
import { ElasticsearchDocumentProvider } from "../documents/ElasticsearchDocumentProvider";
import { CollectionProvider } from "origins-common/collections";

export class ElasticsearchCollectionProvider
  extends ElasticsearchDocumentProvider<Collection>
  implements CollectionProvider {}

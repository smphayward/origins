import { ElasticsearchDocumentProvider } from "../documents/ElasticsearchDocumentProvider";
import { IndexProvider } from "./IndexProvider";
import { IndexRecord } from "./models";

export class ElasticsearchIndexProvider
  extends ElasticsearchDocumentProvider<IndexRecord>
  implements IndexProvider {

  }
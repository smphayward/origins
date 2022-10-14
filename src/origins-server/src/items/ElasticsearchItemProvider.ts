import { ElasticsearchDocumentProvider } from "../documents/ElasticsearchDocumentProvider";

import { Item, ItemProvider } from "origins-common/items";

export class ElasticsearchItemProvider
  extends ElasticsearchDocumentProvider<Item>
  implements ItemProvider {}

import { Link } from "origins-common";
import { Item } from "origins-common/items";
import { urlJoin } from "url-join-ts";

export class ItemHyperlinkUtil {
  private constructor() {}

  public static getThumbnailHref(item: Item): Link {
    return {
      _href: "/" + urlJoin("api", "thumbnails", item.id + ".jpg"),
    };
  }

  public static getItemHref(item: Item): Link {
    return {
      _href: "/" + urlJoin("api", "index", item.id),
    };
  }

  static getWebDavHref(item: Item): Link {
    return {
      _href:
        "/" +
        urlJoin(
          "api",
          "webdav",
          item.collectionId,
          encodeURI(item.fileRelativePath)
        ),
    };
  }
}

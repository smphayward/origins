import * as crypto from "crypto";
import * as path from "path";
import { promises as fs } from "fs";
import { FileSystemObjectType, getPathType } from "../file-system/PathTypeUtil";
import { ThumbnailProvider } from "../thumbnails/ThumbnailProvider";
import { ExtractionProvider } from "../extraction/ExtractionProvider";
import { Config } from "../config/ConfigFactory";
import { ItemProvider } from "origins-common/items";
import { Collection } from "origins-common/collections";

export class ProcessingProvider {
  constructor(
    private readonly _config: Config,
    private readonly _extractionProvider: ExtractionProvider,
    private readonly _itemProvider: ItemProvider,
    private readonly _thumbnailProvider: ThumbnailProvider
  ) {}

  public async processPath(
    collection: Collection,
    relativePath: string, // Relative to the collection's path
    depth: number
  ): Promise<void> {
    // Normalize the relative path to always start with /
    if (!relativePath.startsWith("/")) {
      relativePath = "/" + relativePath;
    }

    // Make sure depth is an integer
    depth = Math.trunc(depth);

    const absolutePath = path.join(collection.rootDirectory, relativePath);

    const pathType = await getPathType(absolutePath);
    if (pathType === FileSystemObjectType.NotFound) {
      throw new Error("Not found!");
    }

    if (pathType === FileSystemObjectType.File) {
      await this.processFile(collection, relativePath, absolutePath);
    }

    if (pathType === FileSystemObjectType.Directory) {
      await this.processDirectory(collection, absolutePath, depth);
    }
  }

  // ----- HELPER METHODS ----- //
  private async processFile(
    collection: Collection,
    relativePath: string, // Relative to the collection's path
    absolutePath: string
  ): Promise<void> {
    
    if (!this._config.fileExtensions.image.includes(path.parse(absolutePath).ext)) {
      console.log(`File type not supported: ${absolutePath}`);
      return;
    }

    console.log(`Processing file: ${absolutePath}`);

    // Normalize the relative path to always start with /
    // This is important when making the id
    if (!relativePath.startsWith("/")) {
      relativePath = "/" + relativePath;
    }

    // Extract information
    const extractedData = await this._extractionProvider.extract(absolutePath, {
      collectionId: collection.id,
      collectionDirectory: collection.rootDirectory,
      relativeFilePath: relativePath,
    });

    // Create index record
    const preHashId = `${collection.id}${relativePath.trimStart()}`;
    const indexRecord: any = {
      id: crypto.createHash("sha256").update(preHashId).digest("base64url"),
    };

    // Add extracted information
    for (const prop in extractedData) {
      indexRecord[prop] = extractedData[prop];
    }

    // Push the index record
    await this._itemProvider.put(indexRecord);

    // Generate thumbnail
    await this._thumbnailProvider.GenerateThumbnail(
      indexRecord.id,
      true,
      absolutePath
    );
  }

  private async processDirectory(
    collection: Collection,
    //relativePath: string,
    absolutePath: string,
    depth: number
  ): Promise<void> {
    console.log(`Processing directory: ${absolutePath}`);
    try {
      const children = await fs.readdir(absolutePath, {
        withFileTypes: true,
      });
      for (const i in children) {
        const child = children[i];
        const childAbsolutePath = path.join(absolutePath, child.name);

        if (child.isFile()) {
          // Relative to the collection's root
          const relativePath = childAbsolutePath.substring(
            collection.rootDirectory.length
          );
          await this.processFile(collection, relativePath, childAbsolutePath);
        } else if (child.isDirectory() && depth !== 0) {
          // This is indentionally !== 0. If someone specifies -1 then depth is infinite.
          await this.processDirectory(collection, childAbsolutePath, depth--);
        }
      }
    } catch (err) {
      console.log("Failed to read directory.");
      console.log(err);
    }
  }
}

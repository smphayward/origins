import Jimp from "jimp";
import * as path from "path";
import * as fsSync from "fs";
import { IndexProvider } from "../index/IndexProvider";
import { IndexRecordFields } from "../index/models";

export interface ThumbnailProviderConfig {
  rootThumbnailDirectory: string;
  imageNotFoundPlaceholderFile: string;
}

export class ThumbnailProvider {
  private readonly _config: ThumbnailProviderConfig;
  private readonly _indexProvider: IndexProvider;
  constructor(config: ThumbnailProviderConfig, indexProvider: IndexProvider) {
    this._config = config;
    this._indexProvider = indexProvider;
  }

  public async GenerateThumbnail(
    indexRecordId: string,
    regenerateIfExists: boolean,
    sourceAbsolutePath?: string
  ) {
    console.log(`Generating thumbnail: '${indexRecordId}'.`);

    // Make sure we have the source path
    if (!sourceAbsolutePath) {
      const indexResponse: any = await this._indexProvider.get(indexRecordId);
      if (!indexResponse) {
        throw new Error(
          "sourceAbsolutePath not specified and could not find index record for item."
        );
      }
      sourceAbsolutePath = indexResponse[
        IndexRecordFields.fileAbsolutePath
      ] as string;
      if (!sourceAbsolutePath) {
        throw new Error(
          "fileAbsolutePath property does not exist on index record"
        );
      }
    }

    // Determine the destination path
    const destinationAbsolutePath = path.join(
      this._config.rootThumbnailDirectory,
      indexRecordId + ".jpg"
    );

    // Short-circuit if exists and we shouldn't regenerate
    if (!regenerateIfExists && fsSync.existsSync(destinationAbsolutePath)) {
      console.log(`Thumbnail already exists. Not regenerating: '${destinationAbsolutePath}'`);
      return destinationAbsolutePath;
    }

    // Make sure the absolute source path exists
    if(!fsSync.existsSync(sourceAbsolutePath)){
      console.error(`Cannot generate thumbnail. File does not exist: '${sourceAbsolutePath}'`);
      return this._config.imageNotFoundPlaceholderFile;
    }

    let error: any = null;

    console.error(`Reading original: '${sourceAbsolutePath}'`);
    const promise = Jimp.read(sourceAbsolutePath)
      .then((image) => {

        console.error(`Finished reading original: '${sourceAbsolutePath}'`);

        let width = image.getWidth();
        let height = image.getHeight();

        if (width > height) {
          width = 500;
          height = Jimp.AUTO;
        } else {
          height = 500;
          width = Jimp.AUTO;
        }

        console.error(`Generating and saving: '${destinationAbsolutePath}'`);

        (image.bitmap as any).exifBuffer = undefined;
        return image
          .resize(width, height)
          .quality(60)

          .write(destinationAbsolutePath, (writeErr) => {
            error = writeErr;
          });
      })
      .catch((err) => {
        error = err;
      });

    await Promise.all([promise]);

    if (error) {
      throw error;
    }

    console.log(`Thumbnail written: '${destinationAbsolutePath}'`);

    return destinationAbsolutePath;
  }
}

//   private readonly _fileSystemProvider: FileSystemProvider;
//   private readonly _config: ThumbnailManagerConfig;

//   constructor(
//     databaseProvider: ElasticsearchDatabaseProvider,
//     fileSystemProvider: FileSystemProvider,
//     config: ThumbnailManagerConfig
//   ) {
//     this._databaseProvider = databaseProvider;
//     this._fileSystemProvider = fileSystemProvider;
//     this._config = config;
//   }

//   public async GenerateThumbnail(
//     documentId: string,
//     regenerateIfExists: boolean): Promise<string | null>  {

//       const thumbPath = this.ResolveThumbnailPath(documentId);
//       const thumbPathType = await this._fileSystemProvider.pathType(thumbPath);

//       if(thumbPathType === FileSystemObjectType.Directory) {
//         throw new Error(`Cannot generate thumbnail. Path '${thumbPath}' already exists as a directory.`);
//       }

//       // Generate the thumbnail if needed
//       if(regenerateIfExists || thumbPathType === FileSystemObjectType.NotFound) {
//         // Get the document from database
//         // Get the absolute path
//         // Generate a thumbnail
//       }

//       return thumbPath;

//   }

//   // Connection to Database
//   // Folder where thumbnails go

//   // ----- Private Helpers ----- //
//   private ResolveThumbnailPath(documentId: string): string {
//     if(documentId.trim().length === 0) {
//       throw new Error("Cannot resolve thumbnail path. documentId is empty.");
//     }
//     return path.join(this._config.rootThumbnailDirectory, documentId + '.jpg');
//   }

// }

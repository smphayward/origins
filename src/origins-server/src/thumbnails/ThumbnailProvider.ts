import Jimp from "jimp";
import * as path from "path";
import * as fsSync from "fs";
import { ItemProvider } from "origins-common/items";

export interface ThumbnailProviderConfig {
  rootThumbnailDirectory: string;
  imageNotFoundPlaceholderFile: string;
}

export class ThumbnailProvider {
  constructor(
    private readonly config: ThumbnailProviderConfig,
    private readonly itemProvider: ItemProvider
  ) {}

  // TODO: Don't throw errors... give responses

  public async GenerateThumbnail(
    itemId: string,
    regenerateIfExists: boolean,
    sourceAbsolutePath?: string
  ) {
    console.log(`Generating thumbnail: '${itemId}'.`);

    // Make sure we have the source path
    if (!sourceAbsolutePath) {
      const itemResponse = await this.itemProvider.get(itemId);
      if (itemResponse.statusCode === 404) {
        throw new Error(
          "sourceAbsolutePath not specified and could not find item."
        );
      }
      if (!itemResponse.success) {
        throw new Error(
          `sourceAbsolutePath not specified and failed to get item. ${itemResponse.statusCode} -- ${itemResponse.message}`
        );
      }
      sourceAbsolutePath = itemResponse.document?.fileAbsolutePath;
      if (!sourceAbsolutePath) {
        throw new Error("fileAbsolutePath property does not exist on item");
      }
    }

    // Determine the destination path
    const destinationAbsolutePath = path.join(
      this.config.rootThumbnailDirectory,
      itemId + ".jpg"
    );

    // Short-circuit if exists and we shouldn't regenerate
    if (!regenerateIfExists && fsSync.existsSync(destinationAbsolutePath)) {
      console.log(
        `Thumbnail already exists. Not regenerating: '${destinationAbsolutePath}'`
      );
      return destinationAbsolutePath;
    }

    // Make sure the absolute source path exists
    if (!fsSync.existsSync(sourceAbsolutePath)) {
      console.error(
        `Cannot generate thumbnail. File does not exist: '${sourceAbsolutePath}'`
      );
      return this.config.imageNotFoundPlaceholderFile;
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

import { promises as fs } from "fs";
import * as path from "path";
import { ExtractedData, ExtractionContext, ExtractionProvider } from "./ExtractionProvider";
import * as crypto from "crypto";

export class FileInfoExtractionProvider implements ExtractionProvider {
  
  constructor() {
    
  }

  public async extract(filePath: string, context: ExtractionContext): Promise<ExtractedData> {
    let metadata: ExtractedData = {};

    // Info that can help later on
    metadata["collectionId"] = context.collectionId;
    metadata["collectionDirectory"] = context.collectionDirectory;
    metadata["fileRelativePath"] = context.relativeFilePath;
    metadata["fileAbsolutePath"] = filePath;

    // General file info
    const stats = await fs.stat(filePath);
    metadata["fileSizeBytes"] = stats.size;
    metadata["fileCreated"] = stats.birthtime;
    metadata["fileModified"] = stats.mtime;

    // File path info
    const parsedPath = path.parse(filePath);
    metadata["filename"] = parsedPath.name;
    metadata["fileExtension"] = parsedPath.ext;

    // ===== Hash for the unique identifier ===== //
    // This hashing method might not be perfect
    // Hopefully, though, it will help detect both duplicates and files that move
    // More ideal would be getting a checksum from the file itself
    // However, this would cause performance to suffer greatly with large quantities of files
    // Perhaps this will be an optional thing in the future to improve accuracy at the expense of speed
    // Perhaps that will be a separate hash function. Named this function accordingly.
    const hashable =
      parsedPath.name +
      parsedPath.ext +
      stats.size +
      stats.birthtime.toISOString();

    // Perhaps this should also be configurable
    // sha256 is somewhat slower but is much less likely to result in a collision
    // sha512 is even slower but even less likely to result in a collision
    // This is almost certainly academic when it comes to a dinky little photo database
    metadata["fileInfoHash"] = crypto.createHash("sha256").update(hashable).digest("base64url");


    // metadata["fileInfoHash"] = await this._fileHasher.generateFileInfoHash(
    //   filePath
    // );

    return metadata;
  }
}

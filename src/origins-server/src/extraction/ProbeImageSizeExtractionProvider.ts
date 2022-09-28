//import { promises as fs } from "fs";
import * as fs from 'fs';
import probe from 'probe-image-size';
import { ExtractionContext, ExtractionProvider } from './ExtractionProvider';

// Seems to be more for video
export class ProbeImageSizeExtractionProvider implements ExtractionProvider {
  public async extract(filePath: string, context: ExtractionContext) {
    try {
      const result = await probe(fs.createReadStream(filePath));

      // TODO: Aspect ratio and common photo size
      // Will have to be approximate

      return result;
    } catch (error) {
      console.log("Error in probe image size extractor");
      console.log(error);
    }
    return {};
  }
}

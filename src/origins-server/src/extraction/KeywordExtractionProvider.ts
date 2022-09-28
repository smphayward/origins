import { stringify } from "querystring";
import { ExtractedData, ExtractionContext, ExtractionProvider } from "./ExtractionProvider";

export type KeywordExtractionProviderConfig = { [property: string]: string[] };

export class KeywordExtractionProvider implements ExtractionProvider {
  private readonly _config: KeywordExtractionProviderConfig;

  constructor(config: KeywordExtractionProviderConfig) {
    this._config = config;
  }

  public async extract(filePath: string, context: ExtractionContext) {
    let extractedData: ExtractedData = {};

    // Strip root directory
    if(filePath.startsWith(context.collectionDirectory)){
      filePath = filePath.substring(context.collectionDirectory.length);
    }

    for (const metadataName in this._config) {
      const keywords = this._config[metadataName];
      const matchingKeywords = keywords.filter((kw) =>
        filePath.toLowerCase().includes(kw.toLowerCase())
      );
      if (matchingKeywords) {
        extractedData[metadataName] = matchingKeywords;
      }
    }

    return extractedData;
  }
}

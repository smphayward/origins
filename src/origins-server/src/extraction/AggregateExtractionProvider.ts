import {
  ExtractedData,
  ExtractionContext,
  ExtractionProvider,
} from "./ExtractionProvider";

export class AggregateExtractionProvider implements ExtractionProvider {
  private readonly _extractionProviders: ExtractionProvider[];

  constructor(...params: ExtractionProvider[]) {
    this._extractionProviders = params;
  }

  public async extract(
    filePath: string,
    context: ExtractionContext
  ): Promise<ExtractedData> {
    let extractedData: ExtractedData = {};

    for (let i = 0; i < this._extractionProviders.length; i++) {
      const ep = this._extractionProviders[i];
      const newExtractedData = await ep.extract(filePath, context);
      for (const prop in newExtractedData) {
        if (!extractedData[prop]) {
          extractedData[prop] = newExtractedData[prop];
        }
      }
    }

    return extractedData;
  }
}

export type ExtractedData = { [name: string]: any} ;

export interface ExtractionContext {
  collectionId: string,
  collectionDirectory: string,
  relativeFilePath: string
}

export interface ExtractionProvider {

  extract:  (filePath: string, context: ExtractionContext) => Promise<ExtractedData>;

}
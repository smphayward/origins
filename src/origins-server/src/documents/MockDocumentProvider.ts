// import { Document } from "./models";
// import { DocumentProvider } from "./DocumentProvider";

// export type MockData<TDocument extends Document> = { [id: string]: TDocument };

// export class MockDocumentProvider<TDocument extends Document>
//   implements DocumentProvider<TDocument>
// {
//   private readonly _data: MockData<TDocument> = {};

//   constructor(initialData?: MockData<TDocument>) {
//     if (initialData) {
//       this._data = initialData;
//     }
//   }

//   public async getAll(): Promise<TDocument[]> {
//     return Object.keys(this._data).map((k) => this._data[k]);
//   }

//   public async get(id: string): Promise<TDocument | null> {
//     return this._data[id] ?? null;
//   }

//   public async put(doc: TDocument): Promise<TDocument> {
//     this._data[doc.id] = doc;
//     return doc;
//   }

//   public async delete(id: string): Promise<boolean> {
//     if (!this._data[id]) {
//       return false;
//     }
//     delete this._data[id];
//     return true;
//   }

//   public async search(lucene: string): Promise<TDocument[]> {
//     return [];
//   }
// }

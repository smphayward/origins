// // Only includes info that actually goes into the repository
// export interface Collection {
//   id: string;
//   name: string;
//   rootDirectory: string;
// }

// // Includes extra info given back by the server
// // This is NOT information required for create/update operations
// export interface CollectionInfo extends Collection {
//   exists?: boolean;
// }

// export const emptyCollection: Collection = {
//   id:'',
//   name: '',
//   rootDirectory: ''
// }

// export const emptyCollectionInfo: CollectionInfo = {
//   id:'',
//   name: '',
//   rootDirectory: '',
//   exists: false
// }
// import { GeneralResponse } from 'origins-common';

import { FileSystemDirectoryWithChildrenArray, FileSystemObjectArray } from "origins-common/file-system";
import { FileSystemObjectArrayItem } from "origins-common/file-system/file-system-array.models";

// ███████ ████████  █████  ████████ ███████ 
// ██         ██    ██   ██    ██    ██      
// ███████    ██    ███████    ██    █████   
//      ██    ██    ██   ██    ██    ██      
// ███████    ██    ██   ██    ██    ███████ 

export interface FileSystemState {
  objects: FileSystemObjectArray; // FileSystemDirectory[];


  selectedDirectoryFullPath?: string;
  selectedDirectory?: FileSystemDirectoryWithChildrenArray;

  selectedObjectFullPath?: string;
  selectedObject?: FileSystemObjectArrayItem;

  //files: FileSystemFile[];

  // selectedDirectoryId?: string;
  // selectedDirectory?: FileSystemDirectory;

  // selectedItemId?: string;
  // selectedItem?: FileSystemObject;
}

// // ██████   █████  ████████  █████  
// // ██   ██ ██   ██    ██    ██   ██ 
// // ██   ██ ███████    ██    ███████ 
// // ██   ██ ██   ██    ██    ██   ██ 
// // ██████  ██   ██    ██    ██   ██ 

// export interface FileSystemObject {
//   id: string;
//   collectionId: string;
//   name: string;
//   objectType: 'directory' | 'file';
// }

// export type FileSystemDirectoryDictionary = { [id: string]: FileSystemDirectory };
// export type FileSystemObjectDictionary = { [id: string]: FileSystemFile | FileSystemDirectory };

// export interface FileSystemFile extends FileSystemObject {
//   objectType: 'file';
// }

// export interface FileSystemDirectory extends FileSystemObject {
//   objectType: 'directory';
//   children?: FileSystemObjectDictionary;
// }



// // ██████  ███████ ███████ ██████   ██████  ███    ██ ███████ ███████ ███████ 
// // ██   ██ ██      ██      ██   ██ ██    ██ ████   ██ ██      ██      ██      
// // ██████  █████   ███████ ██████  ██    ██ ██ ██  ██ ███████ █████   ███████ 
// // ██   ██ ██           ██ ██      ██    ██ ██  ██ ██      ██ ██           ██ 
// // ██   ██ ███████ ███████ ██       ██████  ██   ████ ███████ ███████ ███████ 

// export interface DirectoriesResonse extends GeneralResponse {
//   directories?: FileSystemDirectory[];
// }

// export interface DirectoriesAndFilesReponse extends GeneralResponse {
//   directories?: FileSystemDirectory[];
//   files?: FileSystemFile[];
// }

// export interface GetEverythingResponse extends GeneralResponse {
//   directories?: FileSystemObjectDictionary
// }


// // --- SELECTOR HELPER

// export interface FileSystemDirectoryWithChildrenAsArray extends FileSystemObject {
//   objectType: 'directory';
//   children?: FileSystemDirectoryWithChildrenAsArray[];
// }
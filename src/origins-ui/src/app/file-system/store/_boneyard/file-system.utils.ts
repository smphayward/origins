// import { identifierName } from '@angular/compiler';
// import { FileSystemDirectory, FileSystemDirectoryDictionary, FileSystemDirectoryWithChildrenAsArray, FileSystemFile, FileSystemObject, FileSystemObjectDictionary } from './_boneyard/file-system.models';

// export const getCollectionIdFromDirectoryId = (directoryId: string): string => {
//   const index = directoryId.indexOf('/');
//   if (index === -1) {
//     return directoryId;
//   }
//   return directoryId.substring(0, index);
// };

// export const hasChildDirectories = (
//   directories: FileSystemDirectory[],
//   parentDirectoryId: string
// ): boolean => {
//   return directories.some((d) => isChildOf(parentDirectoryId, d.id));
// };

// export const findChildDirectories = (
//   directories: FileSystemDirectory[],
//   parentDirectoryId: string
// ): FileSystemDirectory[] => {
//   return directories.filter((d) => isChildOf(parentDirectoryId, d.id));
// };

// export const getLevel = (directoryOrFileId: string): number => {
//   // Basically, the number of / in an id
//   return directoryOrFileId.split('/').length - 1;
// };

// export const isChildOf = (
//   parentDirectoryId: string,
//   candidateChildDirectoryOrFileId: string
// ): boolean => {
//   // Child must be different from parent
//   if (parentDirectoryId === candidateChildDirectoryOrFileId) {
//     return false;
//   }

//   // Child must start with parent
//   if (!candidateChildDirectoryOrFileId.startsWith(parentDirectoryId)) {
//     return false;
//   }

//   // Next character of child MUST be '/'
//   if (candidateChildDirectoryOrFileId[parentDirectoryId.length] !== '/') {
//     return false;
//   }

//   // Child must be one level greater than parent
//   if (
//     getLevel(parentDirectoryId) + 1 !==
//     getLevel(candidateChildDirectoryOrFileId)
//   ) {
//     return false;
//   }

//   return true;
// };

// interface FileSystemDirectoryEx extends FileSystemDirectory {
//   level: number;
//   idParts: string[]
// }


// export const immutableUpsert = (
//   original: FileSystemObjectDictionary,
//   entries: FileSystemDirectory[]
// ): FileSystemObjectDictionary => {
  
//   //console.log("BEFORE", original);
  
//   let mutable = { ...original };

  

//   const newEntriesEx: FileSystemDirectoryEx[] = entries
//     // Add in extra information that helps
//     .map((d) => ({
//       ...d,
//       level: getLevel(d.id),
//       idParts: d.id.split('/'),
//     }))
//     // Sort to make sure we go from lowest level to highest
//     // Could be mixed stuff happening here
//     .sort((a, b) => a.level - b.level);

//   for (let i = 0; i < newEntriesEx.length; i++) {
//     const entry = newEntriesEx[i];
//     mutable = immutableUpsertInternal(entry, 0, mutable);
//   }

//   //console.log("AFTER", mutable);

//   return mutable;
// };

// const immutableUpsertInternal = (
//   entry: FileSystemDirectoryEx,
//   currentLevel: number,
//   existing?: FileSystemObjectDictionary
// ): FileSystemObjectDictionary => {

//   // Short-circuit if entry belongs at this level
//   if (entry.level == currentLevel) {
//     const shortCircuit = {
//       ...existing,
//       [entry.id]: { ...entry },
//     };
//     //console.log("SHORT CIRCUIT", shortCircuit);
//     return shortCircuit;
//   }

//   // Get info about whatever is at the current level
//   const currentId = entry.idParts.slice(0, currentLevel + 1).join('/');
//   const currentObject = existing?.[currentId];

//   // console.log("CURRENT OBJECT",{
//   //   partIds: entry.idParts,
//   //   existing, 
//   //   currentId,
//   //   currentObject,
//   //   currentLevel
//   // });

//   // If currentObject (intermediate directory) doesn't exist then it's over
//   // Might need to throw an error in the future?
//   // Of just add in the intermediate directories in the future?
//   if (currentObject === undefined) {
//     return {
//       ...existing,
//     };
//   }

//   // If currentObject is a file, it's over
//   if (currentObject.objectType === 'file') {
//     //console.log("CURRENT OBJECT IS A FILE");
//     return {
//       ...existing,
//     };
//   }

//   // Move on to the next level of children
//   const updatedChildren = immutableUpsertInternal(
//     entry,
//     currentLevel + 1,
//     currentObject.children
//   );

//   return {
//     ...existing,
//     [currentId]: {
//       ...currentObject,
//       children: { ...updatedChildren },
//     },
//   };
// };



// // ----- SELECTOR HELPERS ----- //



// export const fileSystemObjectDictionaryToArray = (
//   dictionary?: FileSystemObjectDictionary
// ): FileSystemDirectoryWithChildrenAsArray[] | undefined => {
//   if (!dictionary) {
//     return undefined;
//   }
//   return Object.keys(dictionary)
//     // Make it into an array
//     .map((key) => dictionary[key])
//     // Remove everything except directories
//     .filter(obj => obj.objectType === 'directory')
//     // Tell TypeScript that we know what we're doing
//     .map(obj => <FileSystemDirectory>obj)
//     .map(dir => ({
//       ...dir,
//       children: fileSystemObjectDictionaryToArray(dir.children)
//     }));
// };

// // export const removeFiles = (array: FileSystemArrayObject[] | undefined): FileSystemDirectoryWithChildrenAsArray[] | undefined => {
// //   if(!array) return undefined;
// //   const temp = array
// //     .filter(o => o.objectType === 'directory')
// //     .map(o => <FileSystemDirectoryWithChildrenAsArray>o)
// //     .map(o => ({
// //       ...o,
// //       children: removeFiles(o.children)
// //     }));
// //   return temp;
// // }

// // export const findDirectory = (
// //   directories: FileSystemDirectory[],
// //   directoryId: string
// // ): FileSystemDirectory | undefined => {
// //   if (directoryId.trim().length === 0) return undefined;

// //   const ids = directoryId.split('/');
// //   let currentDirectories: FileSystemDirectory[] | undefined = directories;
// //   let currentDirectory: FileSystemDirectory | undefined;

// //   for (let i = 0; i < ids.length; i++) {
// //     const id = ids[i];

// //     if (!currentDirectories) {
// //       return undefined;
// //     }

// //     const directoryIndex = currentDirectories.findIndex((d) => d.id === id);
// //     if (directoryIndex === -1) {
// //       return undefined;
// //     }
// //     currentDirectory = currentDirectories[directoryIndex];

// //     // Set up for next loop
// //     currentDirectories = currentDirectory.directories;
// //   }

// //   return currentDirectory;
// // };

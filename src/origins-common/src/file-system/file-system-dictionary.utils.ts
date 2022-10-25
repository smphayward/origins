// ███████ ██   ██ ████████ ██████   █████   ██████ ████████ 
// ██       ██ ██     ██    ██   ██ ██   ██ ██         ██    
// █████     ███      ██    ██████  ███████ ██         ██    
// ██       ██ ██     ██    ██   ██ ██   ██ ██         ██    
// ███████ ██   ██    ██    ██   ██ ██   ██  ██████    ██    

import { FileSystemDirectoryWithChildrenDictionary, FileSystemDirectoryDictionary, FileSystemFileDictionary, FileSystemObjectDictionary } from "./file-system-dictionary.models";
import { BasicFileSystemObject, FileSystemFile, FileSystemObject } from "./file-system.models";
import { isParent } from "./file-system.utils";

export const extractDirectoriesFromDictionary = (dict: FileSystemObjectDictionary): FileSystemDirectoryDictionary => {
  return Object.keys(dict).reduce((prev, curr) => {
    const obj = dict[curr];
    if(obj.objectType === 'file'){
      // Skip file
      return prev;
    }
    prev[curr] = <FileSystemDirectoryWithChildrenDictionary>obj;
    return prev;
  }, <FileSystemDirectoryDictionary>{});
}

export const extractFilesFromDictionary = (dict: FileSystemObjectDictionary): FileSystemFileDictionary => {
  return Object.keys(dict).reduce((prev, curr) => {
    const obj = dict[curr];
    if(obj.objectType === 'directory'){
      // Skip directory
      return prev;
    }
    prev[curr] = <FileSystemFile>obj;
    return prev;
  }, <FileSystemFileDictionary>{});
}

// ██      ███████ ██    ██ ███████ ██      
// ██      ██      ██    ██ ██      ██      
// ██      █████   ██    ██ █████   ██      
// ██      ██       ██  ██  ██      ██      
// ███████ ███████   ████   ███████ ███████ 

export const getRootLevelFromDictionary = (dict: FileSystemObjectDictionary, levelIfExistingIsEmpty: number = 0): number => {

  const keys = Object.keys(dict);
  if(keys.length === 0){
    return levelIfExistingIsEmpty;
  }

  const levels = keys.map(key => dict[key]).map(obj => obj.level);

  const minLevel = Math.min(... levels);

  if(levels.some(l => l !== minLevel)){
    throw new Error(`Cannot determine root level for dictionary because dictionary's root level contains objects with different levels.'`);
  }

  return minLevel;

}


//  █████  ██████  ██████   █████  ██    ██       ██             ██       ██████  ██  ██████ ████████ ██  ██████  ███    ██  █████  ██████  ██    ██ 
// ██   ██ ██   ██ ██   ██ ██   ██  ██  ██       ██               ██      ██   ██ ██ ██         ██    ██ ██    ██ ████   ██ ██   ██ ██   ██  ██  ██  
// ███████ ██████  ██████  ███████   ████       ██   █████ █████   ██     ██   ██ ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████ ██████    ████   
// ██   ██ ██   ██ ██   ██ ██   ██    ██         ██               ██      ██   ██ ██ ██         ██    ██ ██    ██ ██  ██ ██ ██   ██ ██   ██    ██    
// ██   ██ ██   ██ ██   ██ ██   ██    ██          ██             ██       ██████  ██  ██████    ██    ██  ██████  ██   ████ ██   ██ ██   ██    ██    

const arrayToDictionary = (arr: BasicFileSystemObject[]): FileSystemObjectDictionary => {
  return arr.reduce(
    (prev, curr) => {
      if(curr.objectType === 'file') {
        prev[curr.fullPath] = <FileSystemFile>curr;
      }
      else {
        prev[curr.fullPath] = FileSystemDirectoryWithChildrenDictionary.fromFileSystemDirectory(curr);
      }
      return prev;
    }, <FileSystemObjectDictionary>{}
  );
}

// ████████ ██████  ███████ ███████
//    ██    ██   ██ ██      ██     
//    ██    ██████  █████   █████  
//    ██    ██   ██ ██      ██     
//    ██    ██   ██ ███████ ███████

export const updateFileSystemDictionaryTree = (
  existing: FileSystemObjectDictionary,
  newObjects: BasicFileSystemObject[],
  levelIfExistingIsEmpty: number = 0
): FileSystemObjectDictionary => {

  // Everything in existing dictionary must be at same level
  const currentLevel = getRootLevelFromDictionary(existing, levelIfExistingIsEmpty);

  // Are there any new objects at a lower level?
  if(newObjects.some(obj => obj.level < currentLevel)){
    throw new Error(`Root level of existing dictionary is '${currentLevel}' but some of the new objects have a lower level number.`);
  }

  // Spread 'em
  let newDict: FileSystemObjectDictionary = {
    ...existing,
  };  

  // Might not need this sorting
  // // Sort objects by level
  // newObjects = newObjects.sort((a,b) => a.level - b.level);

  // Split objects at current level from items at a different level
  const newObjectsAtHigherLevel =  newObjects.filter(obj => obj.level > currentLevel);

  // Start with things at current level
  const newObjectsAtCurrentLevel = arrayToDictionary(newObjects.filter((obj) => obj.level === currentLevel));
  newDict = {
    ...newDict,
    ...newObjectsAtCurrentLevel,
  };

  // Now deal with stuff at the next level
  // This code DOES NOT deal with newObjects that DO NOT have a parent in the tree.
  //   It just ignores them.

  Object.keys(newDict)
    .map(key => newDict[key])
    .filter(obj => obj.objectType === 'directory')
    .map(obj => <FileSystemDirectoryWithChildrenDictionary>obj)
    .forEach(dir => {

      // Find all things that are descendents of the current directory
      const newDescendents = newObjects.filter(obj => isParent(dir, obj));

      if(newDescendents.length > 0) {
        const existingChildren = dir.children;
        const newChildren = updateFileSystemDictionaryTree(existingChildren ?? {}, newDescendents, currentLevel + 1);

        newDict = {
          ...newDict,
          [dir.fullPath]: dir.clone(newChildren)
        };
      }

    });

    // All done
    return newDict;

};
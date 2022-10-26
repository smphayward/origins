// ███████ ██   ██ ████████ ██████   █████   ██████ ████████
// ██       ██ ██     ██    ██   ██ ██   ██ ██         ██
// █████     ███      ██    ██████  ███████ ██         ██
// ██       ██ ██     ██    ██   ██ ██   ██ ██         ██
// ███████ ██   ██    ██    ██   ██ ██   ██  ██████    ██

import { resolveObjectURL } from 'buffer';
import {
  FileSystemDirectoryArray,
  FileSystemDirectoryWithChildrenArray,
  FileSystemObjectArray,
  FileSystemObjectArrayItem,
} from './file-system-array.models';
import { BasicFileSystemObject, FileSystemFile, FileSystemObject, FileSystemObjectPathInfo } from './file-system.models';
import { isParent, parseFullPath } from './file-system.utils';

export const extractDirectoriesFromArray = (arr: FileSystemObjectArray): FileSystemDirectoryArray => {
  return arr.filter((obj) => obj.objectType === 'directory').map((obj) => <FileSystemDirectoryWithChildrenArray>obj);
};

export const extractFilesFromArray = (arr: FileSystemObjectArray): FileSystemFile[] => {
  return arr.filter((obj) => obj.objectType === 'file').map((obj) => <FileSystemFile>obj);
};

// ██      ███████ ██    ██ ███████ ██
// ██      ██      ██    ██ ██      ██
// ██      █████   ██    ██ █████   ██
// ██      ██       ██  ██  ██      ██
// ███████ ███████   ████   ███████ ███████

export const getRootLevelFromArray = (arr: FileSystemObjectArray, levelIfExistingIsEmpty: number = 0): number => {
  if (arr.length === 0) {
    return levelIfExistingIsEmpty;
  }

  const levels = arr.map((obj) => obj.level);

  const minLevel = Math.min(...levels);

  if (levels.some((l) => l !== minLevel)) {
    throw new Error(
      `Cannot determine root level for array because array's root level contains objects with different levels.'`,
    );
  }

  return minLevel;
};

//  █████  ██████  ██████   █████  ██    ██       ██             ██        █████  ██████  ██████   █████  ██    ██
// ██   ██ ██   ██ ██   ██ ██   ██  ██  ██       ██               ██      ██   ██ ██   ██ ██   ██ ██   ██  ██  ██
// ███████ ██████  ██████  ███████   ████       ██   █████ █████   ██     ███████ ██████  ██████  ███████   ████
// ██   ██ ██   ██ ██   ██ ██   ██    ██         ██               ██      ██   ██ ██   ██ ██   ██ ██   ██    ██
// ██   ██ ██   ██ ██   ██ ██   ██    ██          ██             ██       ██   ██ ██   ██ ██   ██ ██   ██    ██

const arrayToArray = (arr: BasicFileSystemObject[]): FileSystemObjectArray => {
  return arr.reduce((prev, curr) => {
    if (curr.objectType === 'file') {
      prev.push(<FileSystemFile>curr);
    } else {
      prev.push(FileSystemDirectoryWithChildrenArray.fromFileSystemDirectory(curr));
    }
    return prev;
  }, <FileSystemObjectArray>[]);
};

const updateArray = (
  existing: FileSystemObjectArray, 
  newObjects: FileSystemObjectArray,
  objectsToDelete: FileSystemObjectPathInfo[] = []): FileSystemObjectArray => {
  let updated = existing;
  for (let i = 0; i < newObjects.length; i++) {
    const newObject = newObjects[i];
    updated = updateArrayItem(updated, newObject);
  }
  for (let i = 0; i < objectsToDelete.length; i++) {
    const objectToDelete = objectsToDelete[i];
    const indexToDelete = existing.findIndex(obj => obj.fullPath === objectToDelete.fullPath);
    if(indexToDelete >= 0) {
      updated = [
        ...updated.slice(0, indexToDelete),
        ...updated.slice(indexToDelete + 1)
      ]
    }
  }
  return updated;
};

const updateArrayItem = (
  existing: FileSystemObjectArray,
  newObject: FileSystemObjectArrayItem,
): FileSystemObjectArray => {
  // See if the item already exists
  const index = existing.findIndex((obj) => obj.fullPath === newObject.fullPath);

  // If it doesn't exist, add it
  if (index === -1) {
    return [...existing, newObject];
  }
  // If it does exist, update it
  return [...existing.slice(0, index), newObject, ...existing.slice(index + 1)];
};

// ████████ ██████  ███████ ███████
//    ██    ██   ██ ██      ██
//    ██    ██████  █████   █████
//    ██    ██   ██ ██      ██
//    ██    ██   ██ ███████ ███████

export const updateFileSystemArrayTree = (
  existing: FileSystemObjectArray,
  newObjects: BasicFileSystemObject[] = [],
  objectsToDelete: FileSystemObjectPathInfo[] = [],
  levelIfExistingIsEmpty: number = 0,
): FileSystemObjectArray => {

  // Everything in existing dictionary must be at same level
  const currentLevel = getRootLevelFromArray(existing, levelIfExistingIsEmpty);

  // Are there any new objects at a lower level?
  if (newObjects.some((obj) => obj.level < currentLevel)) {
    throw new Error(
      `Root level of existing dictionary is '${currentLevel}' but some of the new objects have a lower level number.`,
    );
  }

  // Do we need to spread this?
  // I'm not convinced we do.
  let newArr = existing;

  // Start with things at current level
  const newObjectsAtCurrentLevel = arrayToArray(newObjects).filter((obj) => obj.level === currentLevel);
  const objectsToDeleteAtCurrentLevel = objectsToDelete.filter(obj => obj.level === currentLevel);

  newArr = updateArray(newArr, newObjectsAtCurrentLevel, objectsToDeleteAtCurrentLevel);

  // Now deal with stuff at the next level
  // This code DOES NOT deal with newObjects that DO NOT have a parent in the tree.
  //   It just ignores them.
  newArr
    .filter((obj) => obj.objectType === 'directory')
    .map((obj) => <FileSystemDirectoryWithChildrenArray>obj)
    .forEach((dir) => {
      // Find all things that are descendents of the current directory
      const newDescendents = newObjects.filter(obj => isParent(dir, obj));
      const descendentsToDelete = objectsToDelete.filter(obj => isParent(dir, obj));

      // Recurse only if it has descendents to add or delete
      if (newDescendents.length > 0 || descendentsToDelete.length > 0) {
        const existingChildren = dir.children;
        const newChildren = updateFileSystemArrayTree(
          existingChildren ?? [],
          newDescendents,
          descendentsToDelete,
          currentLevel + 1,
        );
        newArr = updateArrayItem(newArr, dir.clone(newChildren));
      }
    });

  // All done
  return newArr;
};

// ███████ ██ ███    ██ ██████  
// ██      ██ ████   ██ ██   ██ 
// █████   ██ ██ ██  ██ ██   ██ 
// ██      ██ ██  ██ ██ ██   ██ 
// ██      ██ ██   ████ ██████  

export const findObjectInArrayTree = (
  tree: FileSystemObjectArray,
  fullPathToFind?: string,
): FileSystemObjectArrayItem | undefined => {

  // Short circuit
  if (fullPathToFind === undefined || tree.length === 0) {
    return undefined;
  }

  const { pathParts } = parseFullPath(fullPathToFind);

  let currentTree = tree;
  let currentObject: FileSystemObjectArrayItem | undefined = undefined;

  for (let i = 0; i < pathParts.length; i++) {
    const currentPath = pathParts.slice(0, i+1).join('/');

    // Find the item at the current level
    currentObject = currentTree.find((obj) => obj.fullPath === currentPath);

    // If not found, we're done
    if (currentObject === undefined) {
      return undefined;
    }

    // If found and we're on the last level, we're done
    if (i === pathParts.length - 1) {
      return currentObject;
    }

    // There are more levels.
    // If the current level is a file, we're done.
    // Files don't have children.
    if (currentObject.objectType !== 'directory') {
      return undefined;
    }

    currentTree = currentObject.children;
  }

  return undefined;
};

export const findDirectoryInArrayTree = (
  tree: FileSystemObjectArray,
  fullPathToFind?: string,
): FileSystemDirectoryWithChildrenArray | undefined => {
  const obj = findObjectInArrayTree(tree, fullPathToFind);
  if(obj === undefined || obj.objectType !== 'directory'){
    return undefined;
  }
  return obj;
}

export const findFileInArrayTree = (
  tree: FileSystemObjectArray,
  fullPathToFind?: string,
): FileSystemFile | undefined => {
  const obj = findObjectInArrayTree(tree, fullPathToFind);
  if(obj === undefined || obj.objectType !== 'file'){
    return undefined;
  }
  return obj;
}
import { createReducer, on } from '@ngrx/store';
import {
  changeSelectedDirectory,
  changeSelectedDirectoryToParent,
  changeSelectedObject,
  changeSelectedObjectToNext,
  changeSelectedObjectToPrevious,
  deleteFileSystemObjectSucceeded,
  objectsLoaded,
} from './file-system.actions';
import { FileSystemState } from './file-system.models';
import {
  updateFileSystemArrayTree,
  findDirectoryInArrayTree,
  findObjectInArrayTree,
  FileSystemDirectoryWithChildrenArray,
  FileSystemObjectPathInfo
} from 'origins-common/file-system';
import { FileSystemObjectArray, FileSystemObjectArrayItem } from 'origins-common/file-system/file-system-array.models';

export const initialState: FileSystemState = {
  objects: [],

  // Tree Selection
  selectedDirectoryFullPath: undefined,
  selectedDirectory: undefined,

  // List Selection
  selectedObjectFullPath: undefined,
  selectedObject: undefined,
};

export const fileSystemReducer = createReducer(
  initialState,

  on(objectsLoaded, (state, { objects, removeAllExistingObjects }) => {
    // No objects given - Short circuit
    if (objects === undefined || objects.length === 0) {
      if (removeAllExistingObjects) {
        return {
          ...state,
          objects: [],
        };
      }
      return state;
    }
    const existing = removeAllExistingObjects ? [] : state.objects;
    const newObjects = updateFileSystemArrayTree(existing, objects);
    const firstDirectory = newObjects?.find(obj => obj.objectType === 'directory') as FileSystemDirectoryWithChildrenArray | undefined;
    const firstObject = firstDirectory?.children?.[0];
    
    return {
      ...state,
      objects: newObjects,
      selectedDirectory: firstDirectory,
      selectedDirectoryFullPath: firstDirectory?.fullPath,
      selectedObject: firstObject,
      selectedObjectFullPath: firstObject?.fullPath
    };
  }),

  on(changeSelectedDirectory, (state, { fullPath }) => {
    if (fullPath === undefined) {
      return {
        ...state,
        selectedDirectoryFullPath: undefined,
        selectedDirectory: undefined,
        selectedObjectFullPath: undefined,
        selectedObject: undefined,
      };
    }
    const dir = findDirectoryInArrayTree(state.objects, fullPath);
    const obj = dir?.childDirectories?.[0] ?? dir?.childFiles?.[0];
    return {
      ...state,
      selectedDirectoryFullPath: fullPath,
      selectedDirectory: dir,
      selectedObjectFullPath: obj?.fullPath,
      selectedObject: obj,
    };
  }),

  on(changeSelectedObject, (state, { fullPath }) => {
    if (fullPath === undefined) {
      return {
        ...state,
        selectedObjectFullPath: undefined,
        selectedObject: undefined,
      };
    }
    return {
      ...state,
      selectedObjectFullPath: fullPath,
      selectedObject: findObjectInArrayTree(state.objects, fullPath),
    };
  }),

  on(changeSelectedDirectoryToParent, (state) => {

    console.log('changeSelectedDirectoryToParent', state.selectedDirectory);

    // Do nothing if directory not selected or we're already at the top
    if(state.selectedDirectory === undefined || state.selectedDirectory.level === 0){
      return state;
    }

    return {
      ...state,
      selectedDirectoryFullPath: state.selectedDirectory.parentFullPath,
      selectedDirectory: findDirectoryInArrayTree(state.objects, state.selectedDirectory.parentFullPath),
    };

  }),

  on(changeSelectedObjectToPrevious, (state) => {
    return selectRelativeObject(state, -1);
  }),

  on(changeSelectedObjectToNext, (state) => {
    return selectRelativeObject(state, +1);
  }),

  on(deleteFileSystemObjectSucceeded, (state, {fullPath}) => {
    
    const objectsToDelete = [new FileSystemObjectPathInfo(fullPath)];

    // Do the delete
    let newState = {
      ...state,
      objects: updateFileSystemArrayTree(state.objects, [], objectsToDelete)
    };
    
    // If selected object is what got deleted, unselect it
    if(newState.selectedObjectFullPath === fullPath) {
      newState = {
        ...newState,
        selectedObjectFullPath: undefined,
        selectedObject: undefined
      };
    }

    // If selected directory is what got deleted, unselect it AND the selected object inside
    if(newState.selectedDirectoryFullPath === fullPath) {
      newState = {
        ...newState,
        selectedDirectoryFullPath: undefined,
        selectedDirectory: undefined,
        selectedObjectFullPath: undefined,
        selectedObject: undefined
      };
    }

    // If item that got deleted is child of currentDirectory, remove it
    if(newState.selectedDirectory !== undefined) {
      const newChildren = updateFileSystemArrayTree(newState.selectedDirectory.children, [], objectsToDelete);
      newState = {
        ...newState,
        selectedDirectory: newState.selectedDirectory.clone( newChildren  )
      };
    }

    return newState;

  })

);

// ██   ██ ███████ ██      ██████  ███████ ██████  ███████ 
// ██   ██ ██      ██      ██   ██ ██      ██   ██ ██      
// ███████ █████   ██      ██████  █████   ██████  ███████ 
// ██   ██ ██      ██      ██      ██      ██   ██      ██ 
// ██   ██ ███████ ███████ ██      ███████ ██   ██ ███████ 



const firstDirectoryOrFile = (dir?: FileSystemDirectoryWithChildrenArray): FileSystemObjectArrayItem | undefined => {
  if(dir === undefined) return undefined;
  return dir.childDirectories?.[0] ?? dir.childFiles?.[0];
}

const firstFileOrDirectory = (dir?: FileSystemDirectoryWithChildrenArray): FileSystemObjectArrayItem | undefined => {
  if(dir === undefined) return undefined;
  return dir.childFiles?.[0] ?? dir.childDirectories?.[0];
}

const lastDirectoryOrFile  = (dir?: FileSystemDirectoryWithChildrenArray): FileSystemObjectArrayItem | undefined => {
  if(dir === undefined) return undefined;
  if(dir.childDirectories !== undefined && dir.childDirectories.length > 0){
    return dir.childDirectories[dir.childDirectories.length - 1];
  }
  if(dir.childFiles !== undefined && dir.childFiles.length > 0){
    return dir.childFiles[dir.childFiles.length - 1];
  }
  return undefined;
}

const lastFileOrDirectory = (dir?: FileSystemDirectoryWithChildrenArray): FileSystemObjectArrayItem | undefined => {
  if(dir === undefined) return undefined;
  if(dir.childFiles !== undefined && dir.childFiles.length > 0){
    return dir.childFiles[dir.childFiles.length - 1];
  }
  if(dir.childDirectories !== undefined && dir.childDirectories.length > 0){
    return dir.childDirectories[dir.childDirectories.length - 1];
  }
  return undefined;
}

const selectRelativeObject = (state: FileSystemState, relativeAmount: number): FileSystemState => {

// A few handy things set up at the start
    // Makes it easier to avoid copy-paste
    const clearSelectedObject = {
      ...state,
      selectedObject: undefined,
      selectedObjectFullPath: undefined,
    };

    const fdof = firstDirectoryOrFile(state.selectedDirectory);
    const ffod = firstFileOrDirectory(state.selectedDirectory);
    
    const ldof = lastDirectoryOrFile(state.selectedDirectory);
    const lfod = lastFileOrDirectory(state.selectedDirectory);

    const selectFirstObject = {
      ...state,
      selectedObject: fdof,
      selectedObjectFullPath: fdof?.fullPath,
    };

    // If directory not selected, nothing to do
    if (!state.selectedDirectory) {
      return clearSelectedObject;
    }

    // If directory has no children, make sure selected object is undefined
    if (
      state.selectedDirectory.children === undefined ||
      state.selectedDirectory.children.length === 0
    ) {
      return clearSelectedObject;
    }

    // If there isn't a selected object,
    //  OR, if there is only one child
    // Then select the first one
    // Directory takes priority
    if (
      !state.selectedObject ||
      state.selectedDirectory.children.length === 1
    ) {
      return selectFirstObject;
    }

    // Flow if current object is selected directory
    if (state.selectedObject.objectType === 'directory') {
      // Has no child directories
      // Select the first object
      if (
        state.selectedDirectory.childDirectories === undefined ||
        state.selectedDirectory.childDirectories.length === 0
      ) {
        return selectFirstObject;
      }

      // Get the index of what we have now
      const currentIndex = state.selectedDirectory.childDirectories.indexOf(
        state.selectedObject
      );

      // Current object is not in child directories
      // Select first object
      if (currentIndex === -1) {
        return selectFirstObject;
      }

      const candidateIndex = currentIndex + relativeAmount;

      // Candidate is outside of lower bounds
      // Go to last of other type of array
      if (candidateIndex < 0) {
        return {
          ...state,
          selectedObject: lfod,
          selectedObjectFullPath: lfod?.fullPath,
        };
      }

      // Candidate is outside of upper bounds
      if (candidateIndex >= state.selectedDirectory.childDirectories.length) {
        return {
          ...state,
          selectedObject: ffod,
          selectedObjectFullPath: ffod?.fullPath,
        };
      }

      // Candidate is just right
      const newSelectedObject =
        state.selectedDirectory.childDirectories[candidateIndex];
      return {
        ...state,
        selectedObject: newSelectedObject,
        selectedObjectFullPath: newSelectedObject.fullPath,
      };
      
    }


    // Flow if current object is selected file
    if (state.selectedObject.objectType === 'file') {
      // Has no child directories
      // Select the first object
      if (
        state.selectedDirectory.childFiles === undefined ||
        state.selectedDirectory.childFiles.length === 0
      ) {
        return selectFirstObject;
      }

      // Get the index of what we have now
      const currentIndex = state.selectedDirectory.childFiles.indexOf(
        state.selectedObject
      );

      // Current object is not in child directories
      // Select first object
      if (currentIndex === -1) {
        return selectFirstObject;
      }

      // If candidate index is within the range of directories then use that
      const candidateIndex = currentIndex + relativeAmount;
      
      // Candidate is outside of lower bounds
      // Go to last of other type of array
      if (candidateIndex < 0) {
        return {
          ...state,
          selectedObject: ldof,
          selectedObjectFullPath: ldof?.fullPath,
        };
      }

      // Candidate is outside of upper bounds
      if (candidateIndex >= state.selectedDirectory.childFiles.length) {
        return {
          ...state,
          selectedObject: fdof,
          selectedObjectFullPath: fdof?.fullPath,
        };
      }

      // Candidate is just right
      const newSelectedObject =
        state.selectedDirectory.childFiles[candidateIndex];
      return {
        ...state,
        selectedObject: newSelectedObject,
        selectedObjectFullPath: newSelectedObject.fullPath,
      };
    }

    // If the above mess couldn't figure this out, do nothing.
    return state;


}

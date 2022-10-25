import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FileSystemState } from './file-system.models';

export const fileSystemFeatureSelector =
  createFeatureSelector<FileSystemState>('fileSystem');

export const selectObjects = createSelector(
  fileSystemFeatureSelector,
  (state) => state.objects
);

export const selectSelectedDirectoryFullPath = createSelector(
  fileSystemFeatureSelector,
  (state) => state.selectedDirectoryFullPath
);

export const selectSelectedDirectory = createSelector(
  fileSystemFeatureSelector,
  (state) => state.selectedDirectory
);

export const selectSelectedObject = createSelector(
  fileSystemFeatureSelector,
  (state) => state.selectedObject
);

export const selectSelectedObjectFullPath = createSelector(
  fileSystemFeatureSelector,
  (state) => state.selectedObjectFullPath
);

// TODO: Select only dictionaries

// export const selectDirectoriesArray = createSelector(
//   fileSystemFeatureSelector,
//   (state) => {
//     //console.log("SELECTOR IN", state.directories);
//     const temp = fileSystemObjectDictionaryToArray(state.directories) ?? [];
//     //console.log("SELECTOR OUT", temp);
//     return temp;
//   }
// );

import { createAction, props } from "@ngrx/store";
import { BasicFileSystemObject } from "origins-common/file-system";

// ----- LOAD TREE ----- //
export const requestLoadAllObjects = createAction(
  `[File System] Request Load All Objects`
);

export const objectsLoaded = createAction(
  `[File System] Objects Loaded`,
  props<{ objects?: BasicFileSystemObject[], removeAllExistingObjects: boolean }>()
)

// ----- SELECTED THINGS ----- //
export const clearAllSelections = createAction(
  `[File System] Clear All Selections`
)

// This is for the tree of directories on the left
export const changeSelectedDirectory = createAction(
  `[File System] Change Selected Directory`,
  props<{ fullPath?: string }>()
)

export const changeSelectedDirectoryToParent = createAction(
  `[File System] Change Selected Directory to Parent`
);

// This is for the list of things on the right-top
export const changeSelectedObject = createAction(
  `[File System] Change Selected Object`,
  props<{ fullPath?: string }>()
)

export const changeSelectedObjectToNext = createAction(
  `[File System] Change Selected Object to Next`
);

export const changeSelectedObjectToPrevious = createAction(
  `[File System] Change Selected Object to Previous`
);



// ----------------------

// // ROOT
// export const requestLoadRootDirectories = createAction(
//   `[File System] Request Load Root Directories`
// );

// export const loadRootDirectoriesFailed = createAction(
//   `[File System] Load Root Directories Failed`,
//   props<{reason: string}>()
// );

// // POPULATE CHILDREN (Directories and Files)
// export const requestLoadDirectoryChildren = createAction(
//   `[File System] Request Load Directory Children`,
//   props<{ collectionId: string, directoryId: string }>()
// )

// export const loadDirectoryChildrenFailed = createAction(
//   `[File System] Load Directory Children Failed`,
//   props<{ reason: string }>()
// );

// // Things Loaded
// export const directoriesLoaded = createAction(
//   `[File System] Directories Loaded`,
//   props<{ directories?: FileSystemDirectory[], removeAllExistingDirectories: boolean }>()
// )

// export const filesLoaded = createAction(
//   `[File System] Files Loaded`,
//   props<{ files?: FileSystemFile[], removeAllExistingFiles: boolean }>()
// )






// ------------------









// export const loadRootDirectoriesSucceeded = createAction(
//   `[File System] Load Root Directories Succeeded`,
//   props<{ rootDirectories: FileSystemDirectory[] }>()
// );





// export const loadDirectoryChildrenSucceeded = createAction(
//   `[File System] Load Directory Children Succeeded`,
//   props<{
//     collectionId: string;
//     directoryId: string;
//     // directories?: FileSystemDirectory[];
//     // files?: FileSystemFile[];
//   }>()
// );




// POPULATE GRANDCHILDREN (populate children with depth?)



// Almost need two generic actions
// - Directories Loaded
// - Files Loaded
// Doesn't matter if they are root directories or whatever, really.
// The reducer should be SUPER generic.
// Although we probably need the loadRootDorectoriesSucceeded because it wipes out existing
// Or maybe it's like loading items and collections... we say whether it's a new load or a continuation
// It could either replace or amalgamate
// Going to have to feel my way through this.



// Load Collections

// Load Directory - build the tree progressively, as nodes get opened
// Load the currently selected directory, which includes all children
// When it is expanded, load more




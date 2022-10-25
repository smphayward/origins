import { Injectable } from '@angular/core';
import {
  BasicFileSystemObject,
  FileSystemObjectArray,
} from 'origins-common/file-system';
import {
  combineLatest,
  exhaustMap,
  filter,
  flatMap,
  map,
  merge,
  mergeAll,
  mergeMap,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { CollectionInfoProvider } from 'src/app/collections/services/collection-info-provider.service';
import { WebDAVProvider } from './web-dav-provider.service';

@Injectable({
  providedIn: 'root',
})
export class FileSystemProvider {
  constructor(
    private collectionInfoProvider: CollectionInfoProvider,
    private webDAVProvider: WebDAVProvider
  ) {}

  getAll = (): Observable<BasicFileSystemObject[]> => {
    const x = this.collectionInfoProvider.getAll(1000, undefined).pipe(
      // TODO: Deal with failed responses
      filter((response) => response.success),

      //tap((response) => console.log('Collections response', response)),

      // Just get the document ids for ids that exist
      map(
        (response) =>
          response.documents
            ?.filter((d) => d.rootDirectoryExists)
            ?.map((d) => d.id) ?? []
      ),

      exhaustMap((collectionIds) =>
        merge(
          ...collectionIds.map((collectionId) =>
            this.webDAVProvider
              .getCollectionContents(collectionId)
              .pipe(
                // tap((objects) => console.log(`Objects for ${collectionId}`, objects))
              )
          )
        )
      )

      //tap(x => console.log('after exhaustMap', x))
      //mergeAll()

      // tap(x => console.log(x)),

      // // Use WebDAV Provider to get files & directories for each colleciton id
      // map((collectionIds) =>
      //   collectionIds.map((collectionId) =>
      //     this.webDAVProvider
      //       .getCollectionContents(collectionId)
      //       .pipe(tap((objects) => console.log(`WebDAV for ${collectionId}`, objects)))
      //       .subscribe()

      //   )
      // ),
      // tap(response => console.log("After map", response)),
      // // Turn observable of observable into a single observable

      // mergeMap(response => merge(response)),
      // tap(response => console.log("After mergeMap", response)),

      // // // combineLatest(),
      // // // tap(response => console.log("After combine latest", response)),

      // mergeAll(),
      // tap(response => console.log("Merge all", response)),

      // // // Turn observable of observable[] into an observable of observable
      // // map((arrayOfObservables) => merge(...arrayOfObservables)),

      // // tap(response => console.log("Merge all", response)),
    );
    return x;
  };

  // getEverything(): Observable<GetEverythingResponse>{
  //   return this.collectionInfoProvider
  //     .getAll(1000, undefined)
  //     .pipe(
  //       map((response) => ({
  //         success: response.success,
  //         statusCode: response.statusCode,
  //         message: response.message,
  //         continuationToken: response.continuationToken,
  //         directories: response.documents?.reduce((prev, curr) =>{
  //           prev[curr.id] = {
  //             id: curr.id,
  //             collectionId: curr.id,
  //             name: curr.name,
  //             objectType: 'directory'
  //           };
  //           return prev;
  //         }, <FileSystemObjectDictionary>{})
  //       }))
  //     );
  // }

  // response.documents?.map((ci) => ({
  //   id: ci.id,
  //   collectionId: ci.id,
  //   name: ci.name,
  //   objectType: 'directory'
  // })),

  // getRootDirectories(
  //   maxResults?: number,
  //   continuationToken?: string
  // ): Observable<DirectoriesResonse> {
  //   return this.collectionInfoProvider
  //     .getAll(maxResults, continuationToken)
  //     .pipe(
  //       map((response) => ({
  //         success: response.success,
  //         statusCode: response.statusCode,
  //         message: response.message,
  //         continuationToken: response.continuationToken,
  //         directories: response.documents?.map((ci) => ({
  //           id: ci.id,
  //           collectionId: ci.id,
  //           name: ci.name,
  //           objectType: 'directory'
  //         })),
  //       }))
  //     );
  // }

  // getChildDirectoriesAndFiles(
  //   collectionId: string,
  //   directoryId: string
  // ): Observable<DirectoriesAndFilesReponse> {

  //   // let idPrefix = collectionId;
  //   // if(relativePath && relativePath.trim().length > 0){
  //   //   if(!relativePath.startsWith('/')){
  //   //     idPrefix += '/';
  //   //   }
  //   //   idPrefix += relativePath;
  //   //   if(!relativePath.endsWith('/')){
  //   //     idPrefix += '/';
  //   //   }
  //   // }

  //   return of({
  //     success: true,
  //     statusCode: 200,
  //     message: 'Retrieved directories and files',
  //     directories: [
  //       { id: directoryId + "/Child Dir 1", collectionId, name: "Child Dir 1", objectType: 'directory'},
  //       { id: directoryId + "/Child Dir 2", collectionId, name: "Child Dir 2", objectType: 'directory'},
  //       { id: directoryId + "/Child Dir 3", collectionId, name: "Child Dir 3", objectType: 'directory'},
  //     ],
  //     files: [
  //       { id: directoryId + "/Child File A", collectionId, name: "Child File A", objectType: 'file'},
  //       { id: directoryId + "/Child File B", collectionId, name: "Child File B", objectType: 'file'},
  //       { id: directoryId + "/Child File C", collectionId, name: "Child File C", objectType: 'file'},
  //     ]
  //   });

  // }
}

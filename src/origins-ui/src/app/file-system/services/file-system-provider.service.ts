import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralResponse } from 'origins-common';
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
import { httpResponseToGeneralResponse } from 'src/app/shared/utils/http-utils';
import { WebDAVProvider } from './web-dav-provider.service';

@Injectable({
  providedIn: 'root',
})
export class FileSystemProvider {
  constructor(
    private http: HttpClient,
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
              .pipe
              // tap((objects) => console.log(`Objects for ${collectionId}`, objects))
              ()
          )
        )
      )
    );
    return x;
  };

  delete = (fullPath: string): Observable<GeneralResponse> => {
    const url = `/api/webdav/${fullPath}`;

    return this.http
      .delete<void>(url, { observe: 'response' })
      .pipe(
        tap(response => console.log("Tapped response", response)),
        map(httpResponseToGeneralResponse));
  };
}

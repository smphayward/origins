import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { parsePropFindResponse } from 'origins-common/file-system';
import { BasicFileSystemObject } from "origins-common/file-system";

@Injectable({
  providedIn: 'root',
})
export class WebDAVProvider {
  constructor(private http: HttpClient) {}

  getCollectionContents = (
    collectionId: string
  ): Observable<BasicFileSystemObject[]> => {

    const headers = new HttpHeaders({ Accept: 'application/xml' });
    return this.http
      .request('PROPFIND', `/api/webdav/${collectionId}`, {
        headers,
        observe: 'body',
        responseType: 'text',
      })
      .pipe(map((response) => parsePropFindResponse(response)));
  };

  // Load everything for the stinking collection
}
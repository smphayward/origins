import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CollectionInfo, Collection } from 'origins-common/collections';
import { HttpDocumentProvider } from 'src/app/shared/services/http-document-provider.service';

@Injectable({
  providedIn: 'root',
})
export class CollectionRepositoryService extends HttpDocumentProvider<
  CollectionInfo,
  Collection
> {
  constructor(http: HttpClient) {
    super(http, '/api/collections');
  }
}

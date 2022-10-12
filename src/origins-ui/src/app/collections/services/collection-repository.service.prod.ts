import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpRepositoryService } from "src/app/shared/services/http-repository.service";
import { Collection, CollectionInfo } from "../collections.models";

@Injectable({
  providedIn: 'root',
})
export class CollectionRepositoryService extends HttpRepositoryService<CollectionInfo, Collection> {
  constructor(http: HttpClient) {
    super(http, '/api/collections');
  }

}
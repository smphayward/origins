import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpRepositoryService } from "src/app/shared/services/http-repository.service";
import { Item, ItemInfo } from "../items.models";

@Injectable({
  providedIn: 'root',
})
export class ItemRepositoryService extends HttpRepositoryService<ItemInfo, Item> {
  constructor(http: HttpClient) {
    super(http, '/api/items');
  }

}
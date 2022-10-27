import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemInfo, Item } from 'origins-common/items';
import { HttpDocumentProvider } from 'src/app/shared/services/http-document-provider.service';

@Injectable({
  providedIn: 'root',
})
export class ItemInfoProvider extends HttpDocumentProvider<
  ItemInfo,
  Item
> {
  constructor(http: HttpClient) {
    super(http, '/api/items');
  }
}

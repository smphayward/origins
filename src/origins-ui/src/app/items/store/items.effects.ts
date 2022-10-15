import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { DocumentEffects } from 'src/app/shared/store/document.effects';
import { Item, ItemInfo } from 'origins-common/items';
import { itemActions } from './items.actions';
import { ItemInfoProvider } from '../services/item-info-provider.service';

@Injectable()
export class ItemsEffects extends DocumentEffects<ItemInfo, Item> {

  constructor(
    actions$: Actions,
    repository: ItemInfoProvider
  ) {
    super(actions$, repository, itemActions, 'item');
  }

}

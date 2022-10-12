import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, iif } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { GetManyResult } from 'src/app/shared/models/repository-results';
import { RecordEffects } from 'src/app/shared/store/RecordEffects';
import { Item, ItemInfo } from '../items.models';
import { ItemRepositoryService } from '../services/item-repository.service';
import {  itemActions,
} from './items.actions';

@Injectable()
export class ItemsEffects extends RecordEffects<ItemInfo, Item> {

  constructor(
    actions$: Actions,
    repository: ItemRepositoryService
  ) {
    super(actions$, repository, itemActions);
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { startWith, tap } from 'rxjs';
import { Collection } from '../../collections.models';
import { selectCollections } from '../../store/collections.selectors';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss']
})
export class CollectionListComponent implements OnInit {

  collections$ = this.store.select(selectCollections).pipe(
    startWith([]),
    tap((x) => console.log('Received collections:', x))
  );


  constructor(private store: Store) { }

  ngOnInit(): void {
  }

}

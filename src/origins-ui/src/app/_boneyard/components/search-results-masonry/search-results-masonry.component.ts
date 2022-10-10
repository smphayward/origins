import { Store } from '@ngrx/store';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { selectResults, selectUseLargeImages } from '../../store/selectors';
import { startWith, tap } from 'rxjs';

@Component({
  selector: 'app-search-results-masonry',
  templateUrl: './search-results-masonry.component.html',
  styleUrls: ['./search-results-masonry.component.css'],
})
export class SearchResultsMasonryComponent implements OnInit {
  useLargeImages$ = this.store.select(selectUseLargeImages).pipe(
    startWith(false),
    //tap((x) => console.log('useLargeImages', x))
  );

  searchResults$ = this.store.select(selectResults).pipe(
    startWith([]),
    //tap((x) => console.log('searchResults', x))
  );

  constructor(private readonly store: Store) {}

  ngOnInit(): void {}

  onClick = (index: number) => {
    //this.itemClicked.emit(index);
  };

}

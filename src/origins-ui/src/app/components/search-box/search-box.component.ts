import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getAll, searchByText } from 'src/app/store/actions';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {

  searchText = '';

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  onGetAll = () => {
    this.store.dispatch(getAll());
  }

  onSearch = () => {
    this.store.dispatch(searchByText({ query: this.searchText} ));
  }

}

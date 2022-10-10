import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { collectionActions } from 'src/app/collections/store/collections.actions';
import { itemActions } from 'src/app/items/store/items.actions';
//import { getAll, searchByText } from 'src/app/store/actions';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {

  searchText = '';

  constructor(
    private store: Store,
    // TODO: Do this through an effect
    private router: Router) { }

  ngOnInit(): void {
  }

  onGetAll = () => {
    // TODO: Do this through an effect
    // Have a generic action for getAll() and searchByText()
    // Then, have the effect look at the current route and decide
    // Be cool, too, to keep the search text per feature
    // So switching between collections and images keeps the text
    // But that last thing is too much. And it might not always be desirable. Might even be confusing.
    if(this.router.url === '/collections') {
      this.store.dispatch(collectionActions.getAll())
    }
    else {
      this.store.dispatch(itemActions.getAll());
      //this.store.dispatch(getAll()); // This is the old
    }
    
    
  }

  onSearch = () => {

// TODO: Do this through an effect
    // Have a generic action for getAll() and searchByText()
    // Then, have the effect look at the current route and decide
    // Be cool, too, to keep the search text per feature
    // So switching between collections and images keeps the text
    // But that last thing is too much. And it might not always be desirable. Might even be confusing.
    if(this.router.url === '/collections') {
      this.store.dispatch(collectionActions.searchByText({ query: this.searchText }))
    }
    else {
      this.store.dispatch(itemActions.searchByText({query: this.searchText }));
      //this.store.dispatch(searchByText({ query: this.searchText} )); // This is the old
    }

    
  }

}

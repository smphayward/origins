import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { startWith, tap } from 'rxjs';
import { fetchMoreResults } from 'src/app/store/actions';
import { selectMoreResultsAvailable } from 'src/app/store/selectors';

@Component({
  selector: 'app-items-panel',
  templateUrl: './items-panel.component.html',
  styleUrls: ['./items-panel.component.scss']
})
export class ItemsPanelComponent implements OnInit {

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  private loadMoreOnScroll = false;

  moreResultsAvailable$ = this.store
    .select(selectMoreResultsAvailable)
    .pipe(
      startWith(false),
      tap((b) => (this.loadMoreOnScroll = b))
    )
    .subscribe();

  onScroll = (event: any) => {
    const scrollPercent =
      ((event.target.offsetHeight + event.target.scrollTop) /
        event.target.scrollHeight) *
      100;

    if (this.loadMoreOnScroll && scrollPercent >= 80) {
      this.store.dispatch(fetchMoreResults());
    }
  };


}

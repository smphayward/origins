import { Component, HostListener, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { startWith, tap } from 'rxjs';
import { itemActions } from '../../store/items.actions';
import { selectMoreItemsAvailable } from '../../store/items.selectors';

@Component({
  selector: 'app-items-panel',
  templateUrl: './items-panel.component.html',
  styleUrls: ['./items-panel.component.scss'],
})
export class ItemsPanelComponent implements OnInit {
  // onClick(btn) {
  //   console.log('button', btn, 'number of clicks:', this.numberOfClicks++);
  // }

  constructor(private store: Store) {}

  ngOnInit(): void {}

  private loadMoreOnScroll = false;

  moreResultsAvailable$ = this.store
    .select(selectMoreItemsAvailable)
    .pipe(
      startWith(false),
      tap((b) => (this.loadMoreOnScroll = b))
    )
    .subscribe();

  @HostListener('scroll', ['$event'])
  onScroll = (event: any) => {
    const scrollPercent =
      ((event.target.offsetHeight + event.target.scrollTop) /
        event.target.scrollHeight) *
      100;
    if (this.loadMoreOnScroll && scrollPercent >= 80) {
      this.store.dispatch(itemActions.fetchMoreRecords());
    }
  };
}

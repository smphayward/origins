import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromEvent, map, startWith, tap } from 'rxjs';
import { blankItemInfo } from '../../items.models';
import { itemActions } from '../../store/items.actions';
import { selectHasSelectedItem, selectSelectedItem } from '../../store/items.selectors';

@Component({
  selector: 'app-image-lightbox',
  templateUrl: './image-lightbox.component.html',
  styleUrls: ['./image-lightbox.component.scss'],
})
export class ImageLightboxComponent implements OnInit {
  
  // item$ = this.store
  //   .select(selectLightboxItem)
  //   .pipe(startWith(blankIndexRecord));

  item$ = this.store
  .select(selectSelectedItem)
  .pipe(startWith(blankItemInfo));

  imageSource$ = this.item$.pipe(
    map((item) => item?._links.webdav._href ?? '')
  );

  isVisible$ = this.store.select(selectHasSelectedItem).pipe(
    startWith(false),
    tap((x) => console.log("Item Lightbox Visible:", x))
    //map((index) => index !== undefined)
  );

  // Lightbox Visible?
  // isVisible$ = this.store.select(selectLightboxIndex).pipe(
  //   startWith(undefined),
  //   map((index) => index !== undefined)
  // );

  // useLargeImages$ = this.store.select(selectUseLargeImages).pipe(
  //   startWith(false)
  //   //tap((x) => console.log('useLargeImages', x))
  // );

  // lightboxSelectedResultIndex$ = this.store
  //   .select(selectLightboxIndex)
  //   .pipe(
  //     tap((x) => console.log("Tap", x))
  //     //startWith(undefined)
  //   );

  constructor(private store: Store) {
    fromEvent(window, 'click').subscribe((event: any) => {
      if (event.target.id === 'image-lightbox-modal-backdrop') {
        store.dispatch(itemActions.clearSelectedRecord());
      }
    });
  }

  ngOnInit(): void {}

  showPrevious = () => {
    this.store.dispatch(itemActions.moveToPreviousRecord());
  }

  showNext = () => {
    this.store.dispatch(itemActions.moveToNextRecord());
  }

  close = () => {
    this.store.dispatch(itemActions.clearSelectedRecord());
  }

}

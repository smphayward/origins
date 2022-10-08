import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromEvent, map, startWith, tap } from 'rxjs';
import { clearLightboxItem, showLightboxItem, showNextLightboxItem, showPreviousLightboxItem } from 'src/app/store/actions';
import { blankIndexRecord } from 'src/app/store/models';
import { selectLightboxItem, selectLightboxIndex } from 'src/app/store/selectors';

@Component({
  selector: 'app-image-lightbox',
  templateUrl: './image-lightbox.component.html',
  styleUrls: ['./image-lightbox.component.scss'],
})
export class ImageLightboxComponent implements OnInit {
  item$ = this.store
    .select(selectLightboxItem)
    .pipe(startWith(blankIndexRecord));

  imageSource$ = this.item$.pipe(
    map((item) => item?._links.webdav._href ?? '')
  );

  // Lightbox Visible?
  isVisible$ = this.store.select(selectLightboxIndex).pipe(
    startWith(undefined),
    map((index) => index !== undefined)
  );

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
        store.dispatch(clearLightboxItem());
      }
    });
  }

  ngOnInit(): void {}

  showPrevious = () => {
    this.store.dispatch(showPreviousLightboxItem());
  }

  showNext = () => {
    this.store.dispatch(showNextLightboxItem());
  }

  close = () => {
    this.store.dispatch(clearLightboxItem());
  }

}

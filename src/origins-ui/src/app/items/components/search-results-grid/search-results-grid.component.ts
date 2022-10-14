import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatGridList } from '@angular/material/grid-list';
import { Store } from '@ngrx/store';
import { fromEvent, Observable, startWith, tap } from 'rxjs';
//import { selectResults, selectUseLargeImages } from 'src/app/store/selectors';
import { itemActions } from '../../store/items.actions';
import { selectItems } from '../../store/items.selectors';

@Component({
  selector: 'app-search-results-grid',
  templateUrl: './search-results-grid.component.html',
  styleUrls: ['./search-results-grid.component.scss'],
})
export class SearchResultsGridComponent implements OnInit {
  @ViewChild('theContainer') theContainer: any;

  // useLargeImages$ = this.store.select(selectUseLargeImages).pipe(
  //   startWith(false),
  //   //tap((x) => console.log('useLargeImages', x))
  // );

  // searchResults$ = this.store.select(selectResults).pipe(
  //   startWith([]),
  //   //tap((x) => console.log('searchResults', x))
  // );

  items$ = this.store.select(selectItems).pipe(
    startWith([])
  );

  constructor(private readonly store: Store) {
    fromEvent<UIEvent>(window, 'resize')
        //.debounceTime(1500)
        .subscribe((event: UIEvent) => {
          this.setColNum();
        });
    }

  ngOnInit(): void {}

  ngAfterViewInit(){
    this.setColNum();
  }

  onClick = (index: number) => {
    //this.store.dispatch(showLightboxItem({ index }));
    this.store.dispatch(itemActions.moveToDocument({ index }));
  };

  // encodeURI = (uri: string) => {
  //   return encodeURI(uri);
  // };

  // ----- Automatic Tile Sizing ----- //
  
  onScrol = (event: any) => {
    console.log("Scrolled in grid");
  }

  columnNum = 3; //initial count
  tileSize = 200; //one tile should have this width

  // @HostListener('window:resize', ['$event'])
  // onResize(event: any) {
  //   this.setColNum();
  // }

  setColNum() {
    let width = this.theContainer.nativeElement.offsetWidth;
    this.columnNum = Math.trunc(width / this.tileSize);
    //console.log('Set');
  }
}

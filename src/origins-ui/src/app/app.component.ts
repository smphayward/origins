import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
//import { RepositoryService } from './services/repository.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxMasonryComponent } from 'ngx-masonry';
//import { IndexRecord, MultipleIndexRecordsResult } from './store/models';
import { filter, map, Observable, pairwise, startWith, tap } from 'rxjs';
import { Store } from '@ngrx/store';
// import { fetchMoreResults,  } from './store/actions';
// import { selectMoreResultsAvailable } from './store/selectors';
import { ofType } from '@ngrx/effects';
//import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    @ViewChild(NgxMasonryComponent) masonry!: NgxMasonryComponent;

  // private loadMoreOnScroll = false;

  // moreResultsAvailable$ = this.store
  //   .select(selectMoreResultsAvailable)
  //   .pipe(
  //     startWith(false),
  //     tap((b) => (this.loadMoreOnScroll = b))
  //   )
  //   .subscribe();

  constructor(
    private store: Store,
    //private repositoryService: RepositoryService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  //useLargeImages = false;
  //searchText = '';

  //title = 'origins-ui';
  //x = { y: 'z' };

  // searchResults: IndexRecord[] = [];
  // continuationToken: string | undefined = undefined;
  // lastSearchText: string | undefined = undefined;
  // Last query? to know what to call for loadMore

  // ███████ ██    ██ ███████ ███    ██ ████████     ██   ██  █████  ███    ██ ██████  ██      ███████ ██████
  // ██      ██    ██ ██      ████   ██    ██        ██   ██ ██   ██ ████   ██ ██   ██ ██      ██      ██   ██
  // █████   ██    ██ █████   ██ ██  ██    ██        ███████ ███████ ██ ██  ██ ██   ██ ██      █████   ██████
  // ██       ██  ██  ██      ██  ██ ██    ██        ██   ██ ██   ██ ██  ██ ██ ██   ██ ██      ██      ██   ██
  // ███████   ████   ███████ ██   ████    ██        ██   ██ ██   ██ ██   ████ ██████  ███████ ███████ ██   ██

  // onScroll = (event: any) => {
  //   const scrollPercent =
  //     ((event.target.offsetHeight + event.target.scrollTop) /
  //       event.target.scrollHeight) *
  //     100;

  //   if (this.loadMoreOnScroll && scrollPercent >= 80) {
  //     this.store.dispatch(fetchMoreResults());
  //   }
  // };

  // onGetAll = () => {
  //   this.getAllOrSearch();
  // };

  // onSearch = () => {
  //   if (this.searchText.trim().length === 0) {
  //     this.searchElement.nativeElement.focus();
  //     this.openSnackBar('Please enter search text');
  //     return;
  //   }
  //   this.getAllOrSearch(this.searchText);
  // };

  // onScroll(event: any) {
  //   // visible height + pixel scrolled >= total height

  //   if (
  //     event.target.offsetHeight + event.target.scrollTop >=
  //     event.target.scrollHeight
  //   ) {
  //     this.getMoreResults();
  //   }
  // }

  // onScrolledToEnd() {
  //   this.getMoreResults();
  // }

  // onLargeImagesChanged() {
  //   this.masonry.layout();
  // }

  //  ██████  ███████ ████████     ██████  ███████  ██████  ██████  ██████  ██████  ███████
  // ██       ██         ██        ██   ██ ██      ██      ██    ██ ██   ██ ██   ██ ██
  // ██   ███ █████      ██        ██████  █████   ██      ██    ██ ██████  ██   ██ ███████
  // ██    ██ ██         ██        ██   ██ ██      ██      ██    ██ ██   ██ ██   ██      ██
  //  ██████  ███████    ██        ██   ██ ███████  ██████  ██████  ██   ██ ██████  ███████

  // private getAllOrSearch(searchText?: string) {
  //   // READ THIS LINK!!!
  //   // TODO: https://medium.com/egen/using-angular-httpclient-the-right-way-60c65146e5d9

  //   let observable: Observable<MultipleIndexRecordsResult>;
  //   if (searchText) {
  //     observable = this.searchService.search(this.searchText);
  //     this.lastSearchText = this.searchText.trim();
  //     this.openSnackBar('Searching...');
  //   } else {
  //     observable = this.searchService.getAll();
  //     this.lastSearchText = undefined;
  //     this.openSnackBar('Getting all...');
  //   }

  //   observable.subscribe((resp) => {
  //     this.handleResults(resp, false);
  //   });
  // }

  // private getMoreResults() {
  //   if (this.continuationToken) {
  //     //this.openSnackBar("Loading more...");
  //     if (this.lastSearchText) {
  //       // It was a search
  //     } else {
  //       // It was a get-all
  //       this.searchService.getAll(this.continuationToken).subscribe((resp) => {
  //         this.handleResults(resp, true);
  //         this.lastSearchText = undefined;
  //       });
  //     }
  //   }
  // }

  // private handleResults(
  //   results: MultipleIndexRecordsResult,
  //   isContinuation: boolean
  // ) {
  //   if (!results?.documents) {
  //     this.openSnackBar(`Something went wrong`);
  //     return;
  //   }
  //   if (results.documents.length === 0) {
  //     if (isContinuation) {
  //       this.openSnackBar(`No more results found.`);
  //     } else {
  //       this.openSnackBar(`No results found.`);
  //     }

  //     return;
  //   }
  //   console.log(results.documents);

  //   if (isContinuation) {
  //     this.openSnackBar(`Received ${results.documents.length} MORE results`);
  //     this.searchResults = [...this.searchResults, ...results.documents];
  //     this.masonry.layout();
  //   } else {
  //     this.openSnackBar(`Received ${results.documents.length} results`);
  //     this.searchResults = results.documents;
  //   }
  //   this.continuationToken = results.continuationToken;
  // }

  // ███████ ██   ██  ██████  ██     ██     ████████ ██   ██ ██ ███    ██  ██████  ███████
  // ██      ██   ██ ██    ██ ██     ██        ██    ██   ██ ██ ████   ██ ██       ██
  // ███████ ███████ ██    ██ ██  █  ██        ██    ███████ ██ ██ ██  ██ ██   ███ ███████
  //      ██ ██   ██ ██    ██ ██ ███ ██        ██    ██   ██ ██ ██  ██ ██ ██    ██      ██
  // ███████ ██   ██  ██████   ███ ███         ██    ██   ██ ██ ██   ████  ██████  ███████

  openSnackBar = (message: string) => {
    console.log(`snack on this: ${message}`);
    this.snackBar.open(message, undefined, {
      duration: 4000,
    });
  };

  // showLightbox() {
  //   return;
  //   const cfg: MatDialogConfig = {
  //     //data: { records: this.searchResults, index },
  //     height: '80%',
  //     width: '80%',
      
  //   };
  //   const dialogRef = this.dialog.open(LightboxComponent, cfg);
    
  //   dialogRef.afterClosed().subscribe((result) => {
  //     // Clear Selected Index
  //     this.store.dispatch(showLightboxItem({ index: undefined }));
  //     console.log("Lightbox closed.");
  //     //console.log(`Dialog result: ${result}`);
  //   });
  // }

  // openDialog(index: number) {
  //   const cfg: MatDialogConfig = {
  //     data: { records: this.searchResults, index },
  //     height: '80%',
  //     width: '80%',
  //   };
  //   const dialogRef = this.dialog.open(LightboxComponent, cfg);
    
  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log(`Dialog result: ${result}`);
  //   });

  // }
}

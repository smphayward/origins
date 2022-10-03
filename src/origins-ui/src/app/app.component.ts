import { Component, ElementRef, ViewChild } from '@angular/core';
import { SearchService } from './services/search.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LightboxComponent } from './lightbox/lightbox.component';
import { NgxMasonryComponent } from 'ngx-masonry';
import { IndexRecord, MultipleIndexRecordsResult } from './interfaces/index-record';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('search') searchElement!: ElementRef;
  @ViewChild(NgxMasonryComponent) masonry!: NgxMasonryComponent;

  constructor(
    private searchService: SearchService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}



  useLargeImages = false;
  searchText = '';

  title = 'origins-ui';
  x = { y: 'z' };
  
  searchResults: IndexRecord[] = [  ];
  continuationToken: string | undefined = undefined;
  lastSearchText: string | undefined = undefined;
  // Last query? to know what to call for loadMore

  onGetAll = () => {
    // READ THIS LINK!!!
    // TODO: https://medium.com/egen/using-angular-httpclient-the-right-way-60c65146e5d9
    
    this.searchService.getAll().subscribe((resp) => {
      this.handleResults(resp, false);
      this.lastSearchText = undefined;
    });
  };

  onSearch = () => {
    if (this.searchText.trim().length === 0) {
      this.searchElement.nativeElement.focus();
      this.openSnackBar("Please enter search text");
      return;
    }

    this.searchService.search(this.searchText).subscribe((resp) => {
      this.handleResults(resp, false);
      this.lastSearchText = this.searchText.trim();
    });
  };

  private handleResults(results: MultipleIndexRecordsResult, isContinuation: boolean) {
    if(!results?.documents){
      this.openSnackBar(`Something went wrong`);
      return;
    }
    if(results.documents.length === 0){
      this.openSnackBar(`No more results found.`);
      return;
    }
    console.log(results.documents);

    if(isContinuation){
      this.openSnackBar(`Received ${results.documents.length} MORE results`);
      this.searchResults = [... this.searchResults, ...results.documents]  ;
      this.masonry.layout();
    }
    else{
      this.openSnackBar(`Received ${results.documents.length} results`);
      this.searchResults = results.documents;
    }
    this.continuationToken = results.continuationToken;
    
  }

  openSnackBar = (message: string) => {
    console.log(`snack on this: ${message}`)
    this.snackBar.open(message, undefined, {
      duration: 4000,
    });
  }

  openDialog(index: number) {
    const cfg: MatDialogConfig = {
      data: { records: this.searchResults, index },
      height: "80%",
      width: "80%",
       
    };
    const dialogRef = this.dialog.open(LightboxComponent, cfg);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  largeImagesChanged() {
    this.masonry.layout();
  }
  
  onScroll(event: any) {
    // visible height + pixel scrolled >= total height 
    
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      if(this.continuationToken){
        //this.openSnackBar("Loading more...");
        if(this.lastSearchText){
          // It was a search
        } else {
          // It was a get-all
          this.searchService.getAll(this.continuationToken).subscribe((resp) => {
            this.handleResults(resp, true);
            this.lastSearchText = undefined;
          });
        }
        

      }
      // Load more
      
      console.log("End");
    }
}


}

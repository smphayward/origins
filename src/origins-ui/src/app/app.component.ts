import { Component, ElementRef, ViewChild } from '@angular/core';
import { SearchService } from './services/search.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LightboxComponent } from './lightbox/lightbox.component';
import { NgxMasonryComponent } from 'ngx-masonry';

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
  searchResults: any[] = [
    // { thumb: "http://localhost:8080/thumbnails/xsq50ZFuYbpmPB2v882AUU_dEpKNe5Kwmy7On9xzlv0.jpg"},
    // { thumb: "http://localhost:8080/thumbnails/QOmqAI-H_lQCwX3CXln4CUF1sVyMObn4gsvKCZc9EfA.jpg"},
    // { thumb: "http://localhost:8080/thumbnails/7g95Hswj4-AOJf33dNVDM0Yr_Blzpe7F2ohPHxslYjo.jpg"},
    // { thumb: "http://localhost:8080/thumbnails/6LPYZPOYLn113DofRP3YVZGSKZSudpAU66KhktKg03A.jpg"},
    // { thumb: "http://localhost:8080/thumbnails/I59vC7wcXV2TXHYadri1V-uBrj5EfHAI4fYSBojz1Ko.jpg"},
  ];

  onGetAll = () => {
    // READ THIS LINK!!!
    // TODO: https://medium.com/egen/using-angular-httpclient-the-right-way-60c65146e5d9

    this.searchService.getAll().subscribe((resp) => {
        this.searchResults = resp as [];
        this.openSnackBar("Received results get all");
    });
  };

  onSearch = () => {
    if (this.searchText.trim().length === 0) {
      this.searchElement.nativeElement.focus();
      this.openSnackBar("Please enter search text");
      return;
    }

    this.searchService.search(this.searchText).subscribe((resp) => {
        this.searchResults = resp as [];
        this.searchElement.nativeElement.focus();
        this.openSnackBar("Received results of search");
    });
  };

  openSnackBar = (message: string) => {
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
  


}

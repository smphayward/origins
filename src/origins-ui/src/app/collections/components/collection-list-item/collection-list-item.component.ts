import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Collection } from '../../collections.models';

@Component({
  selector: 'app-collection-list-item',
  templateUrl: './collection-list-item.component.html',
  styleUrls: ['./collection-list-item.component.scss']
})
export class CollectionListItemComponent implements OnInit {

  @Input() collection: Collection = { id: '', rootDirectory: ''};

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onDelete = () => {
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete collection?',
        message: `Would you like to delete collection '${this.collection.id}'?`,
        cancelButtonText: "No",
        okButtonText: "Delete"
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        // TODO: Send the delete action here
      }
      
    });
  }

}

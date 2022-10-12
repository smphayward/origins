import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Collection, emptyCollection } from '../../collections.models';
import { collectionActions } from '../../store/collections.actions';

@Component({
  selector: 'app-collection-list-item',
  templateUrl: './collection-list-item.component.html',
  styleUrls: ['./collection-list-item.component.scss'],
})
export class CollectionListItemComponent implements OnInit {
  @Input() collection: Collection = emptyCollection;

  constructor(public store: Store, public dialog: MatDialog) {}

  ngOnInit(): void {}

  onDelete = () => {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete collection?',
        message: `Would you like to delete collection '${this.collection.id}'?`,
        cancelButtonText: 'No',
        okButtonText: 'Delete',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          collectionActions.requestDeleteRecordById({ id: this.collection.id })
        );
      }
    });
  };
}

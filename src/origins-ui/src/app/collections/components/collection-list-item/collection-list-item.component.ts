import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Collection, emptyCollection } from '../../collections.models';
import { collectionActions } from '../../store/collections.actions';
import { AddEditCollectionComponent } from '../add-edit-collection/add-edit-collection.component';
import { AddEditDialogData } from '../add-edit-collection/AddEditDialogData';

@Component({
  selector: 'app-collection-list-item',
  templateUrl: './collection-list-item.component.html',
  styleUrls: ['./collection-list-item.component.scss'],
})
export class CollectionListItemComponent implements OnInit {
  @Input() collection: Collection = emptyCollection;

  constructor(public store: Store, public dialog: MatDialog) {}

  ngOnInit(): void {}

  onUpdate = () => {
    const data: AddEditDialogData = {
      dialogTitle: 'Edit Collection',
      okButtonText: 'Edit',
      id: this.collection.id,
      name: this.collection.name,
      rootDirectory: this.collection.rootDirectory,
    };

    const dialogRef = this.dialog.open(AddEditCollectionComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          collectionActions.requestUpdateRecord({
            record: {
              id: this.collection.id,
              name: result.name as string,
              rootDirectory: result.rootDirectory as string,
            },
          })
        );
      }
    });
  };

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

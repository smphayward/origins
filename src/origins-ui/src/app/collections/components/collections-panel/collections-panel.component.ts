import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { collectionActions } from '../../store/collections.actions';
import { AddEditCollectionComponent } from '../add-edit-collection/add-edit-collection.component';
import { AddEditDialogData } from '../add-edit-collection/AddEditDialogData';
import { AddEditDialogResult } from '../add-edit-collection/AddEditDialogResult';

@Component({
  selector: 'app-collections-panel',
  templateUrl: './collections-panel.component.html',
  styleUrls: ['./collections-panel.component.scss'],
})
export class CollectionsPanelComponent implements OnInit {
  constructor(public store: Store, public dialog: MatDialog) {}

  ngOnInit(): void {}

  onAdd = () => {
    const data: AddEditDialogData = {
      dialogTitle: 'Add Collection',
      okButtonText: 'Add',
      id: '(Automatically Assigned)',
      name: '',
      rootDirectory: '',
    };

    const dialogRef = this.dialog.open(AddEditCollectionComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          collectionActions.requestAddRecord({
            record: {
              id: '', // Id is not set yet
              name: result.name as string,
              rootDirectory: result.rootDirectory as string,
            },
          })
        );
      }
    });
  };
}

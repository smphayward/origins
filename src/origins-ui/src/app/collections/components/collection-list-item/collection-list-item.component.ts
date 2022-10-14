import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { map, startWith, tap } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { collectionActions } from '../../store/collections.actions';
import { selectCollectionById } from '../../store/collections.selectors';
import { AddEditCollectionComponent } from '../add-edit-collection/add-edit-collection.component';
import { AddEditDialogData } from '../add-edit-collection/AddEditDialogData';

@Component({
  selector: 'app-collection-list-item',
  templateUrl: './collection-list-item.component.html',
  styleUrls: ['./collection-list-item.component.scss'],
})
export class CollectionListItemComponent implements OnInit {
  //@Input() collection: Collection = emptyCollection;
  //collection: Collection = emptyCollection;
  
  @Input() collectionId: string = '';
  @Input() collectionName: string = '';
  @Input() collectionRootDirectory: string = '';
  @Input() collectionRootDirectoryExists: boolean | undefined = false;

  // foo$ = this.store
  //   .select(selectCollectionById({ id: this.collectionId }))
  //   .pipe(
  //     startWith(emptyCollectionInfo),
  //     map((collection) => collection ?? emptyCollectionInfo),
  //     tap((collection) => this.collection = collection)
  //   ).subscribe();

  constructor(public store: Store, public dialog: MatDialog) {}

  ngOnInit(): void {}

  onUpdate = () => {
    const data: AddEditDialogData = {
      dialogTitle: 'Edit Collection',
      okButtonText: 'Edit',
      id: this.collectionId,
      name: this.collectionName,
      rootDirectory: this.collectionRootDirectory,
    };

    const dialogRef = this.dialog.open(AddEditCollectionComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          collectionActions.requestUpdateDocument({
            document: {
              id: this.collectionId,
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
        message: `Would you like to delete collection '${this.collectionName}'?`,
        cancelButtonText: 'No',
        okButtonText: 'Delete',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          collectionActions.requestDeleteDocumentById({ id: this.collectionId })
        );
      }
    });
  };
}

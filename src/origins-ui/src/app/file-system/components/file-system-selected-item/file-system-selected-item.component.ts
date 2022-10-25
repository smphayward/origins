import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { startWith } from 'rxjs';
import { changeSelectedObjectToNext, changeSelectedObjectToPrevious } from '../../store/file-system.actions';
import { selectSelectedObject } from '../../store/file-system.selectors';

@Component({
  selector: 'app-file-system-selected-item',
  templateUrl: './file-system-selected-item.component.html',
  styleUrls: ['./file-system-selected-item.component.scss']
})
export class FileSystemSelectedItemComponent implements OnInit {

  selectedObject$ = this.store.select(selectSelectedObject);

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  webDavUri(fullPath:string){
    return '/api/webdav/' + encodeURI(fullPath);
  }

  onPrevious() {
    this.store.dispatch(changeSelectedObjectToPrevious());
  }

  onNext() {
    this.store.dispatch(changeSelectedObjectToNext());
  }

}

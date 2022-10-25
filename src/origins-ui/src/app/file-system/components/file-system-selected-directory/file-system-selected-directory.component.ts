import { Component, OnInit } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { FileSystemDirectoryWithChildrenArray, FileSystemFile } from 'origins-common/file-system';
import { from, tap } from 'rxjs';
import { changeSelectedDirectoryToParent, changeSelectedObject } from '../../store/file-system.actions';
import { selectSelectedDirectory } from '../../store/file-system.selectors';
import prettyBytes from 'pretty-bytes';

//import { fileSystemMockDirectory } from '../../services/file-system.mock-data';

@Component({
  selector: 'app-file-system-selected-directory',
  templateUrl: './file-system-selected-directory.component.html',
  styleUrls: ['./file-system-selected-directory.component.scss'],
})
export class FileSystemSelectedDirectoryComponent implements OnInit {
  selectedDirectory$ = this.store
    .select(selectSelectedDirectory)
    .pipe(tap((sd) => console.log('Selected directory', sd)));

  constructor(private store: Store) {}

  ngOnInit(): void {}

  selectedItemChanged = (event: MatSelectionListChange) => {
    const selectedObject = event.options?.[0]?.value as string | undefined;
    this.store.dispatch(changeSelectedObject({ fullPath: selectedObject }));
 
  }

  getDirectoryAdditionalInfo(d: FileSystemDirectoryWithChildrenArray) {
    return `Directories: ${d.childDirectories?.length ?? 0}, Files: ${d.childFiles?.length ?? 0}`
  }

  getFileAdditionalInfo(f: FileSystemFile) {
    return `Type: ${f.contentType}, Size: ${prettyBytes(f.contentLength)}`;
  }

  onParent() {
    this.store.dispatch(changeSelectedDirectoryToParent());
  }

}

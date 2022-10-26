import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { requestFileSystemObjectProcessing } from 'src/app/processing/store/processing.actions';
import { changeSelectedDirectory, changeSelectedObject, requestDeleteFileSystemObject } from '../../store/file-system.actions';
import { selectSelectedObject, selectSelectedObjectFullPath } from '../../store/file-system.selectors';

@Component({
  selector: 'app-file-system-object-row',
  templateUrl: './file-system-object-row.component.html',
  styleUrls: ['./file-system-object-row.component.scss']
})
export class FileSystemObjectRowComponent implements OnInit {

  @HostListener('click', ['$event'])
  hostClick(event: any) {
    this.store.dispatch(changeSelectedObject({ fullPath: this.fullPath }));
  }

  // @HostListener('hover', ['$event'])
  // hostHover(event: any) {
  //   console.log("hover", event);
  //   //this.store.dispatch(changeSelectedObject({ fullPath: this.fullPath }));
  // }  

  @Input() name: string = 'Test name';
  @Input() additionalInfo: string = 'test additional'; // 3 directories, 5 files
  @Input() fullPath: string = '';
  @Input() objectType: string = '';
  //isSelected: boolean = false;

  selectedObjectFullPath$ = this.store
    .select(selectSelectedObjectFullPath);
    // .subscribe(sofp => {
    //   this.isSelected = (sofp === this.fullPath);
    // })

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  onClick(event: MouseEvent) {
    
    if(this.objectType === 'directory') {
      this.store.dispatch(changeSelectedDirectory({ fullPath: this.fullPath }));
      event.stopPropagation();
    }
    
    //class="object-icon"
  }

  onTags() {

  }

  onProcess() {
    if(this.objectType === 'directory'){
      // TODO: If it's a directory, prompt whether to do this recursively.
      // Or maybe just assume yes always.
      // For now, we'll just assume we want it to be recursive and set depth to -1.
    }
    this.store.dispatch(
      requestFileSystemObjectProcessing({
        fullPath: this.fullPath,
        depth: -1,
      })
    );
  }

  onRename() {
    
  }

  onDelete() {
    // TODO: Confirm dialog - yes or no
    this.store.dispatch(
      requestDeleteFileSystemObject({
        fullPath: this.fullPath
      })
    );
  }


}

import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';
import { Store } from '@ngrx/store';
import { 
  FileSystemDirectoryWithChildrenArray, 
  extractDirectoriesFromArray 
} from 'origins-common/file-system';
import { tap } from 'rxjs';
import { changeSelectedDirectory, requestLoadAllObjects } from '../../store/file-system.actions';
import { selectObjects, selectSelectedDirectoryFullPath } from '../../store/file-system.selectors';


interface FlatNode {
  id: string;
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-file-system-tree',
  templateUrl: './file-system-tree.component.html',
  styleUrls: ['./file-system-tree.component.scss'],
})
export class FileSystemTreeComponent implements OnInit {
  private _transformer = (
    node: FileSystemDirectoryWithChildrenArray,
    level: number
  ) => {
    return {
      id: node.fullPath,
      expandable: !!node.childDirectories && node.childDirectories.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.childDirectories
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  rootDirectories$ = this.store
    .select(selectObjects)
    .pipe
    //tap((directories) => console.log('Directories', directories))
    ()
    .subscribe((objects) => {
      this.dataSource.data = extractDirectoriesFromArray(objects);
    });

  selectedDirectoryFullPath: string | undefined;

  selectedDirectoryFullPath$ = this.store
    .select(selectSelectedDirectoryFullPath)
    .subscribe((fp) => (this.selectedDirectoryFullPath = fp));

  constructor(private store: Store) {
    
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.store.dispatch(requestLoadAllObjects());
  }

  // hasChild = (_: number, node: FileSystemDirectory) => !!node.children && node.children.length > 0;
  // hasNoChild = (_: number, node: FileSystemDirectory) => !!node.children === false || node.children?.length === 0;

  hasChild = (_: number, node: FlatNode) => node.expandable;

  // TODO: Replace with a selector
  // Allows for selection from elsewhere
  // Also... need to expand node (and all parents)
  // Also... wondering if there should be a root node "Origins"
  isSelected = (node: FlatNode) => node.id === this.selectedDirectoryFullPath;

  nodeClick = (node: FlatNode) => {
    //this.selectedCollectionId = node.id;
    this.store.dispatch(changeSelectedDirectory({ fullPath: node.id }));
  };

  onCodeExpandCollapse = (node: FlatNode) => {
    // if (this.treeControl.isExpanded(node)) {
    //   const childIds = this.getChildDirectoryIds(node);
    //   if (childIds) {
    //     childIds.forEach((id) =>
    //       this.store.dispatch(
    //         requestLoadDirectoryChildren({
    //           collectionId: getCollectionIdFromDirectoryId(id),
    //           directoryId: id,
    //         })
    //       )
    //     );
    //   }
    // }
  };

  getChildDirectoryIds = (node: FlatNode): string[] | undefined => {
    if (!this.treeControl.isExpandable(node)) {
      return undefined;
    }

    const stopAtLevel = node.level;
    const nodes = this.treeControl.dataNodes;
    const nodeIndex = nodes.indexOf(node);

    const ids: string[] = [];

    for (let i = nodeIndex + 1; i < nodes.length; i++) {
      const possibleChildNode = nodes[i];
      if (possibleChildNode.level <= stopAtLevel) {
        break;
      }
      // Only take first-level children
      if (possibleChildNode.level === node.level + 1) {
        ids.push(possibleChildNode.id);
      }
    }

    if (ids.length === 0) {
      return undefined;
    }
    return ids;
  };
}

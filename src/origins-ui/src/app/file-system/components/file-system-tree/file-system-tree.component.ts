import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';
import { fileSystemMockData } from '../../services/file-system.mock-data';
import { FileSystemDirectory } from '../../store/file-system.models';

interface FlatNode {
  id: string;
  expandable: boolean;
  name: string;
  level: number;
  
}

@Component({
  selector: 'app-file-system-tree',
  templateUrl: './file-system-tree.component.html',
  styleUrls: ['./file-system-tree.component.scss']
})
export class FileSystemTreeComponent implements OnInit {

  selectedCollectionId: string | undefined;

// ----- TREE STUFF
  private _transformer = (node: FileSystemDirectory, level: number) => {
    return {
      id: node.id,
      expandable: !!node.directories && node.directories.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.directories,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() { 
    this.dataSource.data = fileSystemMockData;
  }

  ngOnInit(): void {
  }

  // hasChild = (_: number, node: FileSystemDirectory) => !!node.children && node.children.length > 0;
  // hasNoChild = (_: number, node: FileSystemDirectory) => !!node.children === false || node.children?.length === 0;

  hasChild = (_: number, node: FlatNode) => node.expandable;

  isSelected = (node: FlatNode) => node.id === this.selectedCollectionId;
  
  nodeClick = (node: FlatNode) => {
    console.log(node);
    this.selectedCollectionId = node.id;
  }

}

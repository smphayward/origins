import { Component, OnInit } from '@angular/core';
import { fileSystemMockDirectory } from '../../services/file-system.mock-data';

@Component({
  selector: 'app-file-system-selected-directory',
  templateUrl: './file-system-selected-directory.component.html',
  styleUrls: ['./file-system-selected-directory.component.scss']
})
export class FileSystemSelectedDirectoryComponent implements OnInit {

  selectedDirectory = fileSystemMockDirectory;

  constructor() { }

  ngOnInit(): void {
  }

}

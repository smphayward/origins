import { Component, Input, OnInit } from '@angular/core';
import { Collection } from '../../collections.models';

@Component({
  selector: 'app-collection-list-item',
  templateUrl: './collection-list-item.component.html',
  styleUrls: ['./collection-list-item.component.scss']
})
export class CollectionListItemComponent implements OnInit {

  @Input() collection: Collection = { id: '', rootDirectory: ''};

  constructor() { }

  ngOnInit(): void {
  }

}

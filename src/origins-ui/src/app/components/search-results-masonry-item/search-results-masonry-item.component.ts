import { BooleanInput } from '@angular/cdk/coercion';
import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';

@Component({
  selector: 'app-search-results-masonry-item',
  templateUrl: './search-results-masonry-item.component.html',
  styleUrls: ['./search-results-masonry-item.component.css']
})
export class SearchResultsMasonryItemComponent implements OnInit {

  @Input() imageSource = '';
  @Input() useLargeImages: BooleanInput = false;

  @Output() click = new EventEmitter();

  constructor() { }
  
  ngOnInit(): void {
  }

  onClick = () => {
    this.click.emit();
  }

}

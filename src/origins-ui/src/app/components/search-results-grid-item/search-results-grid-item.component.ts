import { BooleanInput } from '@angular/cdk/coercion';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search-results-grid-item',
  templateUrl: './search-results-grid-item.component.html',
  styleUrls: ['./search-results-grid-item.component.scss']
})
export class SearchResultsGridItemComponent implements OnInit {

  @Input() imageSource = '';
  @Input() useLargeImages: BooleanInput = false;

  @Output() click = new EventEmitter();

  constructor() { }
  
  ngOnInit(): void {
  }

  onClick = () => {
    this.click.emit();
  }

  encodeURI = (uri: string) => {
    return encodeURI(uri);
  }
}

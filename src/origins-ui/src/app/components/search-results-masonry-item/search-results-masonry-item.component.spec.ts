import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultsMasonryItemComponent } from './search-results-masonry-item.component';

describe('SearchResultsMasonryItemComponent', () => {
  let component: SearchResultsMasonryItemComponent;
  let fixture: ComponentFixture<SearchResultsMasonryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchResultsMasonryItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchResultsMasonryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

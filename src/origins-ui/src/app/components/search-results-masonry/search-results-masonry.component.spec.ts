import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultsMasonryComponent } from './search-results-masonry.component';

describe('SearchResultsMasonryComponent', () => {
  let component: SearchResultsMasonryComponent;
  let fixture: ComponentFixture<SearchResultsMasonryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchResultsMasonryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchResultsMasonryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultsGridItemComponent } from './search-results-grid-item.component';

describe('SearchResultsGridItemComponent', () => {
  let component: SearchResultsGridItemComponent;
  let fixture: ComponentFixture<SearchResultsGridItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchResultsGridItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchResultsGridItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

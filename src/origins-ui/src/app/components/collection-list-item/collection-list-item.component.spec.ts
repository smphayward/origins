import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionListItemComponent } from './collection-list-item.component';

describe('CollectionListItemComponent', () => {
  let component: CollectionListItemComponent;
  let fixture: ComponentFixture<CollectionListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionListItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

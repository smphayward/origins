import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsPanelComponent } from './collections-panel.component';

describe('CollectionsPanelComponent', () => {
  let component: CollectionsPanelComponent;
  let fixture: ComponentFixture<CollectionsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionsPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

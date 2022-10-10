import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsPanelComponent } from './items-panel.component';

describe('ItemsPanelComponent', () => {
  let component: ItemsPanelComponent;
  let fixture: ComponentFixture<ItemsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

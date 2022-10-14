import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundPanelComponent } from './not-found-panel.component';

describe('NotFoundPanelComponent', () => {
  let component: NotFoundPanelComponent;
  let fixture: ComponentFixture<NotFoundPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotFoundPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotFoundPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSystemPanelComponent } from './file-system-panel.component';

describe('FileSystemPanelComponent', () => {
  let component: FileSystemPanelComponent;
  let fixture: ComponentFixture<FileSystemPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileSystemPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileSystemPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

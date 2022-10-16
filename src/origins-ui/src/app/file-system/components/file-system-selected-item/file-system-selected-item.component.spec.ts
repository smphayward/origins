import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSystemSelectedItemComponent } from './file-system-selected-item.component';

describe('FileSystemSelectedItemComponent', () => {
  let component: FileSystemSelectedItemComponent;
  let fixture: ComponentFixture<FileSystemSelectedItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileSystemSelectedItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileSystemSelectedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

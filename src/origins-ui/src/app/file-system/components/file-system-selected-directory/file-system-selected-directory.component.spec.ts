import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSystemSelectedDirectoryComponent } from './file-system-selected-directory.component';

describe('FileSystemSelectedDirectoryComponent', () => {
  let component: FileSystemSelectedDirectoryComponent;
  let fixture: ComponentFixture<FileSystemSelectedDirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileSystemSelectedDirectoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileSystemSelectedDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

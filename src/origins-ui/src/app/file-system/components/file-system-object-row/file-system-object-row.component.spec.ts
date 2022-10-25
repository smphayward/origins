import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSystemObjectRowComponent } from './file-system-object-row.component';

describe('FileSystemObjectRowComponent', () => {
  let component: FileSystemObjectRowComponent;
  let fixture: ComponentFixture<FileSystemObjectRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileSystemObjectRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileSystemObjectRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

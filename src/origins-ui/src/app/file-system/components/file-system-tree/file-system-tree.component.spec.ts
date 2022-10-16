import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSystemTreeComponent } from './file-system-tree.component';

describe('FileSystemTreeComponent', () => {
  let component: FileSystemTreeComponent;
  let fixture: ComponentFixture<FileSystemTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileSystemTreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileSystemTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

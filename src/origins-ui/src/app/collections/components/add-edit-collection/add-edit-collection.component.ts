import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddEditDialogData } from './AddEditDialogData';
import { AddEditDialogResult } from './AddEditDialogResult';

@Component({
  selector: 'app-add-edit-collection',
  templateUrl: './add-edit-collection.component.html',
  styleUrls: ['./add-edit-collection.component.scss'],
})
export class AddEditCollectionComponent implements OnInit {
  form: FormGroup;
  id: string;
  name: string;
  rootDirectory: string;

  constructor(
    fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditCollectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddEditDialogData
  ) {
    this.id = this.data.id;
    this.name = this.data.name;
    this.rootDirectory = this.data.rootDirectory;
    this.form = fb.group({
      name: [this.name, [Validators.required, Validators.minLength(1)]],
      rootDirectory: [this.rootDirectory, [Validators.required]],
    });
  }

  ngOnInit(): void {}

  onSave = () => {
    const { value, valid } = this.form;
    if (valid) {
      this.dialogRef.close(value as AddEditDialogResult);
    }
  };
  onCancel = () => {
    this.dialogRef.close();
  };
}

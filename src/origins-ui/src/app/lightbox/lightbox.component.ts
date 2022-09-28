import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { blankIndexRecord, IndexRecord } from '../interfaces/index-record';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.css'],
})
export class LightboxComponent implements OnInit {

  currentRecord: IndexRecord = blankIndexRecord;
  currentRecordAsAny: object = {};
  currentIndex: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { records: IndexRecord[], index: number },
    public dialogRef: MatDialogRef<LightboxComponent>
  ) {
    this.currentRecord = data.records[data.index];
    this.currentRecordAsAny = this.currentRecord;
    this.currentIndex = data.index;
  }

  showPreviousImage = () => {
    if(this.currentIndex > 0){
      this.currentIndex--;
      this.currentRecord = this.data.records[this.currentIndex];
      this.currentRecordAsAny = this.currentRecord;
    }
  }

  showNextImage = () => {
    if(this.currentIndex < this.data.records.length - 1){
      this.currentIndex++;
      this.currentRecord = this.data.records[this.currentIndex];
      this.currentRecordAsAny = this.currentRecord;
    }
  }
  
  closeDialog = () => {
    this.dialogRef.close();
  }
  

  ngOnInit(): void {}
}

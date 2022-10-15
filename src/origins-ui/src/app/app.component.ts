import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { map, startWith } from 'rxjs';
import { changeNotificationMessage } from './status/store/status.actions';
import { selectNotificationMessage } from './status/store/status.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  notificationMessage$ = this.store
    .select(selectNotificationMessage)
    .pipe(startWith(undefined))
    .subscribe((message) => {
      if (message) {
        this.openSnackBar(message);
      }
    });

  constructor(private store: Store, private snackBar: MatSnackBar) {}

  openSnackBar = (message: string) => {
    console.log(`snack on this: ${message}`);
    this.snackBar.open(message, undefined, {
      duration: 3000,
    }).afterDismissed().subscribe(() => {
      this.store.dispatch(changeNotificationMessage({ message: undefined }));
    });
  };
}

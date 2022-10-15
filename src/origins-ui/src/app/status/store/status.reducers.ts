import { createReducer, on } from '@ngrx/store';
import { changeNotificationMessage } from './status.actions';
import { StatusState } from './status.models';

export const initialState: StatusState = {
  notificationMessage: undefined,
};

export const statusReducer = createReducer(
  initialState,

  on(changeNotificationMessage, (state, { message }) => {
    return {
      ...state,
      notificationMessage: message,
    };
  })
);

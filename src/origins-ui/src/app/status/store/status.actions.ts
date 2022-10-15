import { createAction, props } from "@ngrx/store";

export const changeNotificationMessage = createAction(
  `[Status] Change Notification Message`,
  props<{ message?: string }>()
);
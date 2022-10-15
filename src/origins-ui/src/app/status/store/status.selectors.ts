import { createFeatureSelector, createSelector } from "@ngrx/store";
import { StatusState } from "./status.models";

export const statusFeatureSelector =  createFeatureSelector<StatusState>('status');

export const selectNotificationMessage = createSelector(
  statusFeatureSelector,
  (state) => state.notificationMessage
);
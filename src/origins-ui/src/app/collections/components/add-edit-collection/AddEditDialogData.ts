import { StringIterator } from "lodash";

export interface AddEditDialogData {
  dialogTitle: string,
  okButtonText: string,

  id: string;
  name: string;
  rootDirectory: string;
}
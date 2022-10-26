import { HttpResponse } from "@angular/common/http";
import { GeneralResponse } from "origins-common";

export const httpResponseToGeneralResponse = (
  res: HttpResponse<GeneralResponse> | any
) : GeneralResponse => {
  if (res instanceof HttpResponse<GeneralResponse>) {
    return res.body;
  }
  return {
    success: false,
    statusCode: 500,
    message: `unknown response. ${JSON.stringify(res)}`
  };
}
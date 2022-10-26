import { HttpResponse } from '@angular/common/http';
import { GeneralResponse } from 'origins-common';

export const httpResponseToGeneralResponse = (
  res:
    | HttpResponse<object>
    | any
): GeneralResponse => {
  console.log('response to convert', res);

  if (res instanceof HttpResponse<object>) {
    // There is no body so just go with the generic response
    if(!res.body) {
      return {
        success: res.status < 400,
        statusCode: res.status,
        message:
          res.status < 400
            ? `Succeeded with stauts ${res.status}`
            : `Failed with status ${res.status}`,
      };
    }
    // Hoping body is compatible with GeneralResponse
    // It SHOULD be.
    // For a language named "typescript", the inability to do type checking is kinda funny. :-D
    return res.body;
  }

  return {
    success: false,
    statusCode: 500,
    message: `unknown response. ${JSON.stringify(res)}`,
  };
};

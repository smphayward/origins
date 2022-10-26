// TODO: Replace this with a standard document-based thing
// For now, we have to roll with what origins-server has
// origins-server will eventually treat processing jobs as documents - just like everything else

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GeneralResponse } from "origins-common";
import { map, Observable, tap } from "rxjs";
import { httpResponseToGeneralResponse } from "src/app/shared/utils/http-utils";


@Injectable({
  providedIn: 'root',
})
export class ProcessingProvider {
  
  constructor(private http: HttpClient){}

  processFileSystemObject = (fullPath: string, depth: number = -1): Observable<GeneralResponse> => {

    const url = `/api/processing/${fullPath}`;
    const body = {
      depth
    };

    return this.http
      .post<GeneralResponse>(url, body, { observe: 'response' })
      .pipe(
        tap(response => console.log("Tapped response", response)),
        map(httpResponseToGeneralResponse)
      );

  }


}
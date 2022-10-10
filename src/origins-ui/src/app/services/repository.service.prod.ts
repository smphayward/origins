// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';
// import { of } from 'rxjs';
// import { MultipleIndexRecordsResult } from '../_boneyard/store/models';

// @Injectable({
//   providedIn: 'root',
// })
// export class RepositoryService {
//   constructor(private http: HttpClient) {}

  
//   // TODO: Configure how many results come at a time somehow
//   private readonly _maxResults = 60;

//   private readonly _emptyResult: MultipleIndexRecordsResult = {
//     continuationToken: undefined,
//     documents: []
//   }

//   getAll(continuationToken?: string): Observable<MultipleIndexRecordsResult> {
//     let url=`/api/index?max=${this._maxResults}`;
//     if(continuationToken){
//       url += `&continue=${continuationToken}`;
//     }
//     return this.http
//       .get<MultipleIndexRecordsResult>(url);
//   }

  

//   search(query: string, continuationToken?: string): Observable<MultipleIndexRecordsResult> {
//     // Give back nothing if no query given
//     if(!query || query.trim().length === 0){
//       return of(this._emptyResult);
//     }
//     let url = `/api/index/search?q=${encodeURI(query)}&max=${this._maxResults}`;
//     if(continuationToken){
//       url += `&continue=${continuationToken}`;
//     }
//     return this.http
//       .get<MultipleIndexRecordsResult>(url);
//   }



// }
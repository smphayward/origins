import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MultipleIndexRecordsResult } from '../interfaces/index-record';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private http: HttpClient) {}

  
  // TODO: Configure how many results come at a time somehow

  private readonly _emptyResult: MultipleIndexRecordsResult = {
    continuationToken: undefined,
    documents: []
  }

  getAll(continuationToken?: string): Observable<MultipleIndexRecordsResult> {
    let url='/api/index';
    if(continuationToken){
      url += `?continue=${continuationToken}`;
    }
    return this.http.get<MultipleIndexRecordsResult>(url);
  }

  

  search(query: string, continuationToken?: string): Observable<MultipleIndexRecordsResult> {
    // Give back nothing if no query given
    if(!query || query.trim().length === 0){
      return of(this._emptyResult);
    }
    let url = '/api/index/search?q=' + encodeURI(query);
    if(continuationToken){
      url += `&continue=${continuationToken}`;
    }
    return this.http.get<MultipleIndexRecordsResult>(url);
  }



}
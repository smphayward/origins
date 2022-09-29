import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IndexRecord } from '../interfaces/index-record';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<IndexRecord[]> {
    return this.http.get<IndexRecord[]>('/api/index');
  }

  search(query: string): Observable<IndexRecord[]> {
    return this.http.get<IndexRecord[]>(
      '/api/index/search?q=' + encodeURI(query)
    );
  }
}
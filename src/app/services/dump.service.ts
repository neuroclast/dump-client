import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import { Observable } from "rxjs/Observable";

import { Dump } from "../objects/dump";
import {Globals} from "../globals";
import {AuthService} from "./auth.service";
import {environment} from "../../environments/environment";

@Injectable()
export class DumpService {
  constructor(
    private  globals: Globals,
    private http: HttpClient,
    private auth: AuthService
  ) { }

  private apiUrl: string = `${environment.apiUrl}/dumps`;

  get(id: string): Observable<Dump> {
    const getUrl = `${this.apiUrl}/view/${id}`;
    return this.http.get<Dump>(getUrl);
  }

  delete(id: string): Observable<Object> {
    let parameters = new HttpParams();
    parameters = parameters.set('publicId', id);
    const deleteUrl = `${this.apiUrl}/delete`;
    return this.http.delete(deleteUrl, {params: parameters, observe: "response"});
  }

  getPage(type: string, page: number, limit: number): Observable<Dump[]> {
    const getUrl = `${this.apiUrl}/range`;
    let parameters = new HttpParams();

    if(type != null) {
      parameters = parameters.set('type', type.toString());
    }

    parameters = parameters.set('page', page.toString());
    parameters = parameters.set('limit', limit.toString());
    return this.http.get<Dump[]>(getUrl, {params: parameters});
  }

  getRecent(mine?: boolean): Observable<Dump[]> {
    const getUrl = `${this.apiUrl}/recent`;

    if(mine) {
      let parameters = new HttpParams();
      parameters = parameters.set('mine', 'true');
      return this.http.get<Dump[]>(getUrl, { params: parameters });
    }

    return this.http.get<Dump[]>(getUrl);
  }

  getByUser(username: string, viewAll: boolean): Observable<Dump[]> {
    const getUrl = `${this.apiUrl}/user`;

    if(username) {
      let parameters = new HttpParams();
      parameters = parameters.set('username', username);
      parameters = parameters.set('viewAll', viewAll?"true":"false");
      return this.http.get<Dump[]>(getUrl, {params: parameters});
    }

    return this.http.get<Dump[]>(getUrl);
  }

  add(dump: Dump): Observable<any> {
    const postUrl = `${this.apiUrl}/add`;
    return this.http.post(postUrl, dump, {observe: 'response', responseType: 'text' as 'json'});
  }

  update(dump: Dump): Observable<any> {
    const postUrl = `${this.apiUrl}/add`;
    return this.http.post(postUrl, dump, {observe: 'response', responseType: 'text' as 'json'});
  }
}

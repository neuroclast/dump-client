import { Injectable } from '@angular/core';
import {Globals} from "../objects/globals";
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {User} from "../objects/user";
import {HttpObserve} from "@angular/common/http/src/client";
import {environment} from "../../environments/environment";

@Injectable()
export class UserService {
  constructor(
    private  globals: Globals,
    private http: HttpClient
  ) { }

  private apiUrl: string = `${environment.apiUrl}/users`;

  checkExists(username: string)  {
    const getUrl = `${this.apiUrl}/exists/${username}`;
    return this.http.get(getUrl, {observe: 'response'});
  }

  add(user: User) {
    const observe: HttpObserve = 'response';

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: observe
    };

    const postUrl = `${this.apiUrl}/add`;

    return this.http.post(postUrl, user, httpOptions);
  }

  getPublicProfile(username: string) {
    const getUrl = `${this.apiUrl}/profile`;

    let parameters = new HttpParams();
    parameters = parameters.set('username', username);

    return this.http.get<User>(getUrl, { params: parameters });
  }
}

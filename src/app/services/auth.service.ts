import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {Md5} from "ts-md5/dist/md5";
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Globals} from "../globals";
import {JWTJson} from "../objects/jwt-json";
import {Subject} from "rxjs/Subject";
import {Jwt} from "../objects/jwt";
import {environment} from "../../environments/environment";
import {User} from "../objects/user";

@Injectable()
export class AuthService {

  private apiUrl: string = `${environment.apiUrl}/users`;

  constructor(
    public http: HttpClient,
    public router: Router,
    public globals: Globals
  ) { }

  public userJwt: Subject<Jwt> = new Subject();

  public login(username: string, password: string, remember: boolean): Observable<JWTJson> {
    let passwordHash = Md5.hashStr(password) as string;

    let parameters = new HttpParams();
    parameters = parameters.set('username', username);
    parameters = parameters.set('password', passwordHash);
    parameters = parameters.set('remember', remember.toString());

    const getUrl = `${this.apiUrl}/login`;
    return this.http.get<JWTJson>(getUrl, {params: parameters});
  }

  public logout(): void {
    localStorage.clear();
    this.userJwt.next(null);
    window.location.href = "/login";
  }

  public getSession(): Jwt {
    let jwtString: string = localStorage.getItem('jwt_token');
    return new Jwt(jwtString);
  }

  public getSessionUser(): string {
    let jwt = this.getSession();

    if(jwt.payload && jwt.payload.username) {
      return jwt.payload.username;
    }

    return null;
  }

  public setSession(jwtString: string): void {
    let jwt: Jwt = new Jwt(jwtString);

    // store session data in localStorage
    localStorage.setItem('user_id', jwt.payload.sub);
    localStorage.setItem('username', jwt.payload.username);
    localStorage.setItem('expiration', jwt.payload.exp);
    localStorage.setItem('jwt_token', jwtString);

    // store session data in object
    this.userJwt.next(jwt);
  }

  public isAuthenticated(): boolean {
    if(localStorage.getItem('jwt_token'))
      return true;

    return false;
  }

  public getProfile() {
    const getUrl = `${this.apiUrl}/myprofile`;
    return this.http.get<User>(getUrl);
  }
}

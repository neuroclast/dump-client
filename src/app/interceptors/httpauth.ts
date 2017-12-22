import {Injectable, Injector} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../services/auth.service";

@Injectable()
export class HttpAuth implements HttpInterceptor {

  private auth: AuthService;

  constructor(
    private inj: Injector
  ) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    this.auth = this.inj.get(AuthService)

    if(this.auth.isAuthenticated()) {
      let duplicate = req.clone({
        headers: req.headers.set('authorization', "Bearer " + this.auth.getSession().token)
      });
      return next.handle(duplicate);
    }

    return next.handle(req);
  }
}

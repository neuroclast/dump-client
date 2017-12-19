import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Jwt} from "../../objects/jwt";
import {environment} from "../../../environments/environment";
import {ErrorHandler} from "../../utils/errorhandler";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  profile: any = {
    username: ""
  };
  public avatarSrc = "../../../assets/t.gif";

  constructor(
    public auth: AuthService
  ) { }

  ngOnInit() {
    if(this.auth.isAuthenticated())
    {
      let userObj: Jwt = this.auth.getSession();
      this.profile.username = userObj.payload.username;

      this.auth.getProfile()
        .subscribe((result) => {
            this.profile = result;

            this.avatarSrc = `${environment.apiUrl}/users/avatar/${result.username}.png`;
          },
          (err) => {
            ErrorHandler.http(this.auth, err);
          });
    }
  }

}

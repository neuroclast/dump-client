import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Dump} from "../../objects/dump";
import {UserService} from "../../services/user.service";
import {User} from "../../objects/user";
import {environment} from "../../../environments/environment";
import {DumpService} from "../../services/dump.service";
import {AuthService} from "../../services/auth.service";
import { Exposure} from "../../objects/enumerations";
import {ErrorHandler} from "../../utils/errorhandler";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public username: string = "Anonymous";
  public user: User;
  public userAvatar: string = "../../../assets/t.gif";
  public dumps: Dump[];
  public neverDate: number = new Date(0).getTime();
  public pageTitle: string = "";

  constructor(
    private userService: UserService,
    private dumpService: DumpService,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username');

    if(this.username == null) {
      this.router.navigate(['/']);
      return;
    }

    this.pageTitle = `${this.username}'s Public Dumps`;

    this.getUser();

    if(this.auth.isAuthenticated()) {
      this.getDumps(true);
    }
    else {
      this.getDumps(false);
    }
  }

  onClick(publicId: string) {
    this.router.navigate([`/v/${publicId}`]);
  }

  getUser() {
    this.userService.getPublicProfile(this.username)
      .subscribe(
        (result: User) => {
          this.user = result;
          this.userAvatar = `${environment.apiUrl}/users/avatar/${this.user.username}.png`;
        });
  }

  getDumps(viewAll: boolean) {
    this.dumpService.getByUser(this.username, viewAll)
      .subscribe(
        (result: Dump[]) => {
          this.dumps = result;
        },
        (err) => {
          ErrorHandler.http(this.auth, err);
        });
  }

}

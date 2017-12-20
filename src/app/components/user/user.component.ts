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
import {Globals} from "../../objects/globals";

declare var $;

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
  public deleteTargetTitle: string = "";
  public deleteTargetId: string = "";

  constructor(
    private userService: UserService,
    private dumpService: DumpService,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    public globals: Globals
  ) { }

  ngOnInit() {
    // subscribe to url changes
    this.route.params.subscribe(() => {
      this.loadUserPage();
    });
  }

  loadUserPage() {
    this.username = this.route.snapshot.paramMap.get('username');

    if(this.username == null) {
      this.router.navigate(['/']);
      return;
    }

    this.pageTitle = `${this.username}'s Public Dumps`;

    this.getUser();

    if(this.auth.isAuthenticated() && this.auth.getSessionUser() == this.username) {
      this.pageTitle = "My Dumps";
      this.getDumps(true);
    }
    else {
      this.getDumps(false);
    }
  }

  deleteDlg(title, publicId) {
    this.deleteTargetTitle = title;
    this.deleteTargetId = publicId;

    $('#deleteModal').modal();
  }

  deleteDump(target) {
    this.dumpService.delete(target)
      .subscribe((response: Response) => {
        if(response && response.status == 200) {
          this.getDumps(true);
        }
      },
      (err) => {
        ErrorHandler.http(this.auth, err);
      });
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

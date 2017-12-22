import { Component, OnInit } from '@angular/core';
import {DumpService} from "../../services/dump.service";
import {Dump} from "../../objects/dump";
import {AuthService} from "../../services/auth.service";
import {Globals} from "../../globals";
import {ErrorHandler} from "../../utils/errorhandler";

@Component({
  selector: 'app-recent',
  templateUrl: './recent.component.html',
  styleUrls: ['./recent.component.css']
})
export class RecentComponent implements OnInit {

  publicDumps: Dump[];
  privateDumps: Dump[];
  username: string;
  isAuth: boolean;

  constructor(
    private dumpService: DumpService,
    private authService: AuthService,
    private globals: Globals
  ) { }

  ngOnInit() {
    this.getRecentDumps();
    this.getPrivateDumps();
  }

  getRecentDumps(): void {
   this.dumpService.getRecent()
     .subscribe((dumps) => {
      this.publicDumps = dumps.slice(0, 10);
     });
  }

  getPrivateDumps(): void {
    this.isAuth = this.authService.isAuthenticated();

    if(this.isAuth){
      this.username = this.authService.getSession().payload.username;

      this.dumpService.getRecent(true)
        .subscribe((dumps) => {
          this.privateDumps = dumps.slice(0, 4);
        },
        (err) => {
        ErrorHandler.http(this.authService, err);
        });
    }
  }
}

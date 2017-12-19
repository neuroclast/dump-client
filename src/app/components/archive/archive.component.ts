import { Component, OnInit } from '@angular/core';
import {Dump} from "../../objects/dump";
import {DumpService} from "../../services/dump.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Globals} from "../../objects/globals";

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {

  public dumps: Dump[];
  public page: number = 0;
  public neverDate: number = 0;
  public olderDisabled: boolean = false;
  public newerDisabled: boolean = true;
  private pageLimit: number = 10;
  private type: string;

  constructor(
    private dumpService: DumpService,
    private router: Router,
    private route: ActivatedRoute,
    private globals: Globals
  ) { }

  ngOnInit() {
    this.type = this.route.snapshot.paramMap.get('type');

    this.getDumps(0);
  }

  getDumps(pageNum: number) {
    this.dumpService.getPage(this.type, pageNum, this.pageLimit)
      .subscribe(
        (result: Dump[]) => {
          this.dumps = result;
          this.page = pageNum;
          this.newerDisabled = false;
          this.olderDisabled = false;

          if(pageNum == 0) {
            this.newerDisabled = true;
          }

          if(this.dumps.length < this.pageLimit) {
            this.olderDisabled = true;
          }
        });
  }

  onClick(publicId: string) {
    this.router.navigate([`/v/${publicId}`]);
  }

}

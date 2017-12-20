import {Component, ElementRef, OnInit, ViewChild, NgZone, ChangeDetectorRef, ApplicationRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { DumpService } from "../../services/dump.service";
import { Dump } from "../../objects/dump";
import { Globals} from "../../objects/globals";
import { environment} from "../../../environments/environment";

// required to call external JS directly
declare var Prism;

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  public dump: Dump;
  public dumpAuthor: string;
  public expiration: Date = new Date();
  public contentSize: number;
  public neverDate: Date = new Date();
  public userAvatar: string = "../../../assets/t.gif";
  public showPretty: boolean;

  @ViewChild("contentTarget") hlTarget: ElementRef;

  constructor(
    private dumpService: DumpService,
    private route: ActivatedRoute,
    private globals: Globals
  ) {
  }

  ngOnInit(): void {
    this.showPretty = true;
    this.dumpAuthor = "Anonymous";
    this.dump = new Dump();
    this.contentSize = 0;
    this.neverDate = new Date(0);

    // subscribe to url changes
    this.route.params.subscribe(() => {
      this.getDump();
    });
  }

  toggleRaw() {
    this.showPretty = !this.showPretty;
  }

  getDump(): void {
    this.dumpAuthor = "Anonymous";

    const id: string = this.route.snapshot.paramMap.get('id');
    this.dumpService.get(id)
      .subscribe(
        (result: Dump) => {
        this.dump = result;

        if(this.dump.title.length == 0) {
          this.dump.title = "Untitled";
        }

        this.contentSize = this.dump.contents.length;
        this.expiration = new Date(this.dump.expiration);

        this.hlTarget.nativeElement.innerText = this.dump.contents;

        Prism.highlightElement(this.hlTarget.nativeElement, this.dump.type);

        // find author username
        if(this.dump.username)
        {
            this.dumpAuthor = this.dump.username;
            this.userAvatar = `${environment.apiUrl}/users/avatar/${this.dumpAuthor}.png`;
        }
      },
      (error: any) => {
        // unable to find dump id
        if (error['status'] == 404) {
          console.error(`Unable to find dump ${id}`);
        }
      });
  }
}

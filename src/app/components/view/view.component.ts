import {Component, ElementRef, OnInit, ViewChild, NgZone, ChangeDetectorRef, ApplicationRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'
import { DumpService } from "../../services/dump.service";
import { Dump } from "../../objects/dump";
import { Globals} from "../../globals";
import { environment} from "../../../environments/environment";

// required to call external JS directly
declare var hljs;
declare var Clipboard;
declare var $;

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
    private globals: Globals,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.showPretty = true;
    this.dumpAuthor = "Anonymous";
    this.dump = new Dump();
    this.contentSize = 0;
    this.neverDate = new Date(0);
    this.dump.contents = "Please wait, dump is loading...";

    new Clipboard('#copyBtn', {
      text: function() {
        return document.querySelector('#rawContents').innerHTML;
      }
    });

    // subscribe to url changes
    this.route.params.subscribe(() => {
      this.getDump();
    });
  }

  download(publicId: string) {
    window.open(`${environment.apiUrl}/dumps/view/${publicId}?download=true`);
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.querySelector('#prettyCode').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print from dump.sh</title>
        </head>
        <body onload="window.print();window.close()"><pre><code>${printContents}</code></pre></body>
      </html>`
    );
    popupWin.document.close();
  }

  toggleRaw() {
    this.showPretty = !this.showPretty;
  }

  getDump(): void {
    $('#loadingModal').modal("show");

    this.dumpAuthor = "Anonymous";

    const id: string = this.route.snapshot.paramMap.get('id');

    this.dumpService.get(id)
      .subscribe(
        (result: Dump) => {
          this.dump = result;

          if (this.dump.title.length == 0) {
            this.dump.title = "Untitled";
          }

          this.contentSize = this.dump.contents.length;
          this.expiration = new Date(this.dump.expiration);

          this.hlTarget.nativeElement.innerText = this.dump.contents;

          let numLines = (this.dump.contents.match(/\n/g) || []).length;

          for(let i = 1; i <= numLines + 1; i++) {
            document.querySelector('.line-numbers').innerHTML += `${i}<br />`;
          }

          hljs.configure({
            language: this.dump.type
          });
          hljs.highlightBlock(this.hlTarget.nativeElement);

          // find author username
          if (this.dump.username) {
            this.dumpAuthor = this.dump.username;
            this.userAvatar = `${environment.apiUrl}/users/avatar/${this.dumpAuthor}.png`;
          }
        },
        (error: any) => {
          // unable to find dump id
          if (error['status'] == 404) {
            this.router.navigate(['/404']);
          }
        },
        ()=>{
          $('#loadingModal').modal("hide");
        });
  }
}

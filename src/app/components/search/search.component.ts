import { Component, OnInit } from '@angular/core';
import {Dump} from "../../objects/dump";
import {DumpService} from "../../services/dump.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Globals} from "../../globals";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subject} from "rxjs/Subject";
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

declare var $;

/**
 * Search page handler
 */
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public dumps: Dump[];
  public page: number = 0;
  public neverDate: number = 0;
  public olderDisabled: boolean = false;
  public newerDisabled: boolean = true;
  private pageLimit: number = 20;
  private type: string;
  private types: any;
  searchForm: FormGroup;
  changeSub: any = new Subject<string>();

  constructor(
    private dumpService: DumpService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private globals: Globals
  ) { }

  ngOnInit() {
    this.changeSub
      .debounceTime(1000)
      .distinctUntilChanged()
      .subscribe(() => {
        this.onSubmit();
    });

    this.type = this.route.snapshot.paramMap.get('type');

    this.createForm(this.type);
    this.types = Object.keys(this.globals.dumpTypeMap);

    this.getDumps(0);
  }

  createForm(type) {
    this.searchForm = this.fb.group({
      contents: '',
      title: '',
      type: type?type:"any"
    });
  }

  onSubmit() {
    $('#loadingModal').modal("show");

    this.type = this.searchForm.value.type;

    if(this.type == "any") {
      this.type = null;
    }

    this.getDumps(0);
  }

  getDumps(pageNum: number) {
    this.dumpService.getSearchPage(this.type, pageNum, this.pageLimit, this.searchForm.value.title, this.searchForm.value.contents)
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

          $('#loadingModal').modal("hide");
        });
  }

  onClick(publicId: string) {
    this.router.navigate([`/v/${publicId}`]);
  }

}

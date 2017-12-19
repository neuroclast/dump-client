import {Component, OnInit, ViewChild} from '@angular/core';
import { DumpService }            from "../../services/dump.service";
import { FormBuilder, FormGroup, Validators }  from "@angular/forms";
import {Dump} from "../../objects/dump";
import {Router} from "@angular/router";
import {RecentComponent} from "../recent/recent.component";
import {AuthService} from "../../services/auth.service";
import {Globals} from "../../objects/globals";

@Component({
  selector: 'app-dump',
  templateUrl: './dump.component.html',
  styleUrls: ['./dump.component.css']
})
export class DumpComponent implements OnInit {

  dumpForm: FormGroup;
  error: boolean;
  errorText: string;
  private types: any;

  @ViewChild(RecentComponent)
  private recent: RecentComponent;

  constructor(
    private dumpService: DumpService,
    private fb: FormBuilder,
    public auth: AuthService,
    private router: Router,
    public globals: Globals
  ) {
  }

  ngOnInit() {
    this.createForm();
    this.types = Object.keys(this.globals.dumpTypeMap);
  }

  createForm() {
    this.dumpForm = this.fb.group({
      contents: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      type: 'none',
      expiration: -1,
      exposure: 0,
      title: ['', Validators.maxLength(251)]
    });
  }

  onSubmit() {
    let dump: Dump = this.prepareDump();

    // validate contents
    if(!dump.contents || dump.contents.trim().length < 1) {
      this.errorText = "Dude! You can't create an empty dump. Duh.";
      this.error = true;
      return;
    }

    // trim whitespace on title
    dump.title = dump.title.trim();

    dump.username = "Anonymous";

    if(this.auth.isAuthenticated()) {
      dump.username = this.auth.getSession().payload.username;
    }

    this.dumpService.add(dump)
      .subscribe((data) => {
        if(data && data.status == 200) {
          document.location.href = `/v/${data.body}`;
        }
      },
      (err) => {
        this.errorText = "Unable to add dump. Please try again.";
        this.error = true;
      }
    );
  }

  prepareDump(): Dump {
    const formModel = this.dumpForm.value;

    let expirationDate: Date = new Date(0);

    if(formModel.expiration != -1) {
      expirationDate = this.dateAdd(new Date(), 'minute', formModel.expiration);
    }

    return {
      id: -1,
      publicId: '',
      username: '',
      dateTime: new Date(),
      exposure: formModel.exposure as number,
      expiration: expirationDate,
      type: formModel.type as string,
      views: 0,
      title: formModel.title.slice(0, 250),
      contents: formModel.contents as string
    };
  }

  revert() { this.ngOnChanges(); }

  dateAdd(date, interval, units): Date {
    let ret = new Date(date);

    let checkRollover = () => {
      if(ret.getDate() != date.getDate())
        ret.setDate(0);
      };

    switch(interval.toLowerCase())  {
      case 'year'   :  ret.setFullYear(ret.getFullYear() + units); checkRollover();  break;
      case 'quarter':  ret.setMonth(ret.getMonth() + 3*units); checkRollover();  break;
      case 'month'  :  ret.setMonth(ret.getMonth() + units); checkRollover();  break;
      case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
      case 'day'    :  ret.setDate(ret.getDate() + units);  break;
      case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
      case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
      case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
      default       :  ret = undefined;  break;
    }
    return ret;
  }

  ngOnChanges() {
    this.dumpForm.reset({
      title: '',
      exposure: 0,
      expiration: -1,
      type: 'None',
      contents: ''
    });
  }

}

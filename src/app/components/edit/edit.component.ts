import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DumpService} from "../../services/dump.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {Globals} from "../../objects/globals";
import {Dump} from "../../objects/dump";
import {environment} from "../../../environments/environment";
import {Location} from '@angular/common';
import {Exposure} from "../../objects/enumerations";
import {DateAdd} from "../../utils/dateadd";
import {errorHandler} from "@angular/platform-browser/src/browser";
import {ErrorHandler} from "../../utils/errorhandler";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  dumpForm: FormGroup;
  types: any;
  dump: Dump;
  public error: boolean;
  public errorText: string;

  constructor(
    private dumpService: DumpService,
    private fb: FormBuilder,
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public globals: Globals
  ) { }

  ngOnInit() {
    this.createForm();
    this.types = Object.keys(this.globals.dumpTypeMap);
  }

  createForm() {
    // set form defaults
    this.dumpForm = this.fb.group({
      contents: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      type: 'none',
      expiration: -1,
      exposure: 0,
      title: ['', Validators.maxLength(251)]
    });

    // load dump for editing
    this.getDump();
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
      dump.username = this.auth.getSessionUser();
    }

    this.dumpService.update(dump)
      .subscribe((data) => {
          if(data && data.status == 200) {
            document.location.href = `/v/${data.body}`;
          }
        },
        (err) => {
          // handle expired session if necessary
          ErrorHandler.http(this.auth, err);

          this.errorText = "Unable to update dump. Please try again.";
          this.error = true;
        }
      );
  }

  prepareDump(): Dump {
    const formModel = this.dumpForm.value;

    let expirationDate: Date = new Date(0);

    if(formModel.expiration != -1) {
      expirationDate = DateAdd.calc(new Date(), 'minute', formModel.expiration);
    }

    return {
      id: this.dump.id,
      publicId: this.dump.publicId,
      username: this.dump.username,
      dateTime: new Date(),
      exposure: formModel.exposure as number,
      expiration: expirationDate,
      type: formModel.type as string,
      views: this.dump.views,
      title: formModel.title.slice(0, 250),
      contents: formModel.contents as string
    };
  }

  getDump(): void {
    const id: string = this.route.snapshot.paramMap.get('id');

    this.dumpService.get(id)
      .subscribe(
        (result: Dump) => {
          this.dump = result;

          this.dumpForm.setValue({
            contents: this.dump.contents,
            type: this.dump.type,
            expiration: -1,
            exposure: this.dump.exposure.toString() == "PUBLIC" ? 0 : this.dump.exposure.toString() == "UNLISTED" ? 1 : 2,
            title: this.dump.title
          });

          if(!this.auth.isAuthenticated() || this.auth.getSessionUser().toLowerCase() != this.dump.username.toLowerCase()) {
            this.router.navigate(['/']);
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

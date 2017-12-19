import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {User} from "../../objects/user";
import {Router} from "@angular/router";
import {ErrorHandler} from "../../utils/errorhandler";
import {Md5} from "ts-md5/dist/md5";

@Component({
  selector: 'app-controlpanel',
  templateUrl: './controlpanel.component.html',
  styleUrls: ['./controlpanel.component.css']
})
export class ControlpanelComponent implements OnInit {

  cpForm: FormGroup;
  profile: any;
  public avatarSrc: string = "../../../assets/t.gif";

  constructor(
    public auth: AuthService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.cpForm = this.fb.group({
      username: {value: '', disabled: true},
      email: null,
      website: null,
      avatar: null,
      password: null
    });

    // verify authorized user
    if(!this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
      return;
    }

    this.auth.getProfile()
      .subscribe((result) => {
        this.profile = result;

          this.cpForm = this.fb.group({
            username: {value: this.profile.username, disabled: true},
            email: this.profile.email,
            website: this.profile.website,
            avatar: null,
            password: null
          });

          this.avatarSrc = `${environment.apiUrl}/users/avatar/${this.profile.username}.png`;
      },
      (err) => {
        ErrorHandler.http(this.auth, err);
    });
  }

  private prepareSave(): any {
    // TODO: validate password requirements
    let password = null;

    if(this.cpForm.get('password') != null) {
      password = Md5.hashStr(this.cpForm.get('password').value);
    }

    let input = new FormData();
    input.append('email', this.cpForm.get('email').value);
    input.append('website', this.cpForm.get('website').value);
    input.append('avatar', this.cpForm.get('avatar').value);

    if(password != null) {
      input.append('password', password);
    }

    return input;
  }

  submitStopper(e){
    e.preventDefault();
  }

  onSubmit() {
    const formModel = this.prepareSave();

    const postUrl = `${environment.apiUrl}/upload/profile`;
    this.http.post<User>(postUrl, formModel).subscribe(
      (result) => {
        window.location.reload(true);
      },
      (err) => {
        //TODO: error message for file size
        console.log("Failed to upload. Probably too large.");
        ErrorHandler.http(this.auth, err);
      }
    )
  }

  fileChange(event) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.cpForm.get('avatar').setValue(file);

      this.avatarSrc = "../../../assets/avatar_pending.png";
    }
  }

}

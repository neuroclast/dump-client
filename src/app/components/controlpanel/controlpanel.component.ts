import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {User} from "../../objects/user";
import {Router} from "@angular/router";
import {ErrorHandler} from "../../utils/errorhandler";

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
      email: '',
      website: '',
      avatar: null
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
            avatar: null
          });

          this.avatarSrc = `${environment.apiUrl}/users/avatar/${this.profile.username}.png`;
      },
      (err) => {
        ErrorHandler.http(this.auth, err);
    });
  }

  private prepareSave(): any {
    let input = new FormData();
    input.append('email', this.cpForm.get('email').value);
    input.append('website', this.cpForm.get('website').value);
    input.append('avatar', this.cpForm.get('avatar').value);
    return input;
  }

  onSubmit() {
    const formModel = this.prepareSave();

    const postUrl = `${environment.apiUrl}/upload/profile`;
    this.http.post<User>(postUrl, formModel).subscribe(
      (result) => {
        window.location.reload(true);
      },
      (err) => {
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

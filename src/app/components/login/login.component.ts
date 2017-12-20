import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {User} from "../../objects/user";
import {Md5} from "ts-md5/dist/md5";
import {AuthService} from "../../services/auth.service";
import {JWTJson} from "../../objects/jwt-json";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  fromRegistration: boolean;
  loginForm: FormGroup;
  public error: boolean = false;
  public errorText: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.createForm();

    // subscribe to url changes
    this.route.queryParams.subscribe((params) => {
      let username = params.username;
      let registered = params.registered;

      if(username) {
        this.loginForm.setValue({username: username, password: ''});
      }

      if(registered) {
        this.fromRegistration = true;
      }
    });
  }

  onSubmit() {
    this.error = false;

    let formValues = this.loginForm.value;

    this.authService.login(formValues.username, formValues.password, formValues.remember)
      .subscribe((result) => {
        if(result && result.jwt) {
          this.authService.setSession(result.jwt);

          window.location.href = "/";
        }
      },
      (err)=> {
        this.errorText = "Invalid login or password!";
        this.error = true;
      });
  }

  createForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required ],
      password:  ['', Validators.required ],
      remember: false
    });
  }

}

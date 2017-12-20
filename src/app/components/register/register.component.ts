import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {User} from "../../objects/user";
import {Route, Router} from "@angular/router";
import {Md5} from "ts-md5/dist/md5";

declare var $;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.createForm();

    $(function () {
      $('[data-toggle="popover"]').popover()
    })
  }

  createForm() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required ],
      password:  ['', Validators.required ],
      email:  ['', Validators.required ]
    });
  }

  onSubmit() {
    // TODO: validate form fields

    // make sure username is available
    this.userService.checkExists(this.registerForm.value.username)
      .subscribe((response) => {
          if(response && response.status == 200) {
            // TODO: error condition for "username exists"
          }
        },
        (err) => {
          if(err && err.status == 404) {
            // username is available, continue registration
            this.submitRegistration();
          }
        });
  }

  submitRegistration() {
    let formValues = this.registerForm.value;
    let user: User = {
      id: -1,
      username: formValues.username,
      email: formValues.email,
      password: Md5.hashStr(formValues.password) as string,
      avatar: null,
      joined: new Date(),
      website: '',
      views: 0
    };

    // add user to database
    this.userService.add(user)
      .subscribe((response) => {
          if(response && response.status == 200) {
            // success! redirect to login page
            this.router.navigate(['/login'], {queryParams: {registered: true, username: user.username}});
          }
        },
        (err) => {
          // TODO: report error to user
          console.log("Error");
          console.log(err);
        });
  }

}

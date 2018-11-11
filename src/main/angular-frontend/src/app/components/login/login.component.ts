import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../services/alert.service";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private alertService: AlertService,
              private userService: UserService,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.loginForm = new FormGroup({
      'username': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    });
  }

  onLogin() {
    this.userService.login(this.loginForm.value).subscribe(
      () => {
        this.alertService.success("Successfully logged in!");
        this.router.navigate(['/home']);
      },
      () => {
        this.alertService.error("Wrong username or password!");
      }
    )
  }

}

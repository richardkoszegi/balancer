import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/UserService";
import {AlertService} from "../../services/AlertService";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  newUserForm: FormGroup;

  constructor(private alertService: AlertService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.newUserForm = new FormGroup({
      'username': new FormControl('', Validators.required, this.usernameAlreadyTaken.bind(this)),
      'password': new FormControl('', Validators.required),
      'matchingPassword': new FormControl('', Validators.required)
    }, this.passwordMatcherValidator);
  }

  onCreateUser() {
    this.userService.register(this.newUserForm.value).subscribe(() => {
      this.alertService.info("User Successfully registered");
      this.router.navigate(['/login']);
    }, (error: HttpErrorResponse) =>{
      this.alertService.error(error.message);
      console.log(error)
    })
  }

  passwordMatcherValidator(group: FormGroup): {[s: string]: boolean} {
    if (group.controls.password.value !== group.controls.matchingPassword.value) {
      return {'notMatchingPassword': true};
    }
    return null;
  }

  usernameAlreadyTaken(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      this.userService.checkIfUsernameExists(control.value).subscribe( (taken: boolean) => {
        if (taken) {
          resolve({'usernameIsTaken': true});
        }
        resolve(null);
      });
    });
    return promise;
  }

}

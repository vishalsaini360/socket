import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  LoginForm: FormGroup
  show: boolean;
  loginStatus: boolean = false
  adminEmail: any
  adminPassword: any
  constructor(
    private route: Router,
    private spinner: NgxSpinnerService,
    private service: AppService,
    private cookieService: CookieService
  ) { this.show = false }

  ngOnInit() {
    this.LoginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
      remberMe: new FormControl('', []),
    });
    this.LoginForm.patchValue({
      email: this.cookieService.get('Email'),
      password: this.cookieService.get('Password'),
      remberMe: this.cookieService.check('CheckBox')
    })

  }

  loginFunction(loginData) {

    this.spinner.show();
    if (this.LoginForm.invalid) {
      this.spinner.hide();
      return
    }
    if (loginData.remberMe == false) {
      this.cookieService.delete('Email');
      this.cookieService.delete('Password');
      this.cookieService.delete('CheckBox');
    }

    if (loginData.remberMe == true) {
      this.cookieService.set('Email', loginData.email);
      this.cookieService.set('Password', loginData.password);
      this.cookieService.set('CheckBox', loginData.remberMe);
    }
    let apiData = {
      "email": loginData.email,
      "password": loginData.password,
    }

    this.service.postApi('/api/v1/user/userLogin', apiData, 0).subscribe((success) => {
      if (success.status == 200) {
        this.route.navigate(['/dashboard'])
        localStorage.setItem('token', success.data.jwtToken);
        localStorage.setItem("_id", success.data._id)
        localStorage.setItem("name", success.data.name)
        // localStorage.setItem("profilePic", success.data.profilePic)
        this.service.succ(success.message)
        this.spinner.hide();
      }
      else {
        this.service.err(success.message)
        this.spinner.hide();
      }
    }, error => {
      this.service.err("Something went wrong")
      this.spinner.hide();
    })
  }
  forgotPassword() {
    this.route.navigate(['/forgot-password'])
  }

  password() {
    this.show = !this.show;
  }


}

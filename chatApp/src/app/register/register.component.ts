import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
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
  ) { }

  ngOnInit(): void {
    this.LoginForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
    });
  }

  loginFunction(loginData) {
    console.log(this.LoginForm.value)
    this.spinner.show();
    if (this.LoginForm.invalid) {
      this.spinner.hide();
      return
    }



    let apiData = {
      "name": loginData.name,
      "email": loginData.email,
      "mobileNo": loginData.mobile,
      "password": loginData.password,
    }

    this.service.postApi('/api/v1/user/createUser', apiData, 0).subscribe((success) => {
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

  password() {
    this.show = !this.show;
  }

}

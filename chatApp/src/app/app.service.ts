import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class AppService {
  error(response_message: any): any {
    throw new Error("Method not implemented.");
  }

  httpOptions: { headers: any; };
  // baseUrl = "http://18.220.205.59:3019";
  baseUrl = "http://localhost:3001";
  // baseUrl = "http://3.128.74.178:3019";
  constructor(
    public http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private _location: Location
  ) { }

  getApi(url): Observable<any> {
    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    }
    return this.http.get(this.baseUrl + url, this.httpOptions);
  }

  getApiWithAuth(url): Observable<any> {
    this.httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        'Authorization': localStorage.getItem('token')
      }),
    }
    return this.http.get(this.baseUrl + url, this.httpOptions);
  }

  formdataApi(url, data): Observable<any> {
    var httpOptions;
    httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('token') }),
      observe: 'response'
    }
    return this.http.post((this.baseUrl + url), data, httpOptions)
  }

  succ(msg) {
    this.toastr.success(msg);
  }
  err(msg) {
    this.toastr.error(msg);
  }
  showSpinner() {
    this.spinner.show()
  }
  hideSpinner() {
    this.spinner.hide()
  }
  backClicked() {
    this._location.back();
  }


  postApi(url, data, isHeader): Observable<any> {
    if (!isHeader) {
      this.httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" }),
      }
      return this.http.post(this.baseUrl + url, data);
    }
    else {
      this.httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json", 'token': localStorage.getItem('LOGINTOKEN'), '_id': localStorage.getItem('_id') }),
      }
      return this.http.post(this.baseUrl + url, data, this.httpOptions);
    }
  }


  postApiWithAuth(url, data, isHeader): Observable<any> {
    if (!isHeader) {
      this.httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" }),
      }
    } else {
      this.httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          'Authorization': localStorage.getItem('token')
        })
      }
    }
    return this.http.post(this.baseUrl + url, data, this.httpOptions);
  }

}

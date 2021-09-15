import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
declare var $: any

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  [x: string]: any;
  searchForm: FormGroup;
  formvalidation: any = { submitted: false }
  userArr: any = [];
  pageNumber = 1;
  limit=30
  total: any;
  srNumber: any;
  dateValue: any;
  userId: any;
  id: any;
  email: any;
  editUserForm: any;
  nowDate2: any;
  spinnerService: any;
  flag: number;
  buttonDisable: number;
  formdata = new FormData
  fileLength: any;
  todayDate: Date;
  sendNotificationForm: FormGroup;
  allSendNotificationForm: FormGroup;
  mailForm: FormGroup;
  countryCode: any;
  mobileNumber: any;
  notificationType:any


  constructor(
    public service: AppService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private _location: Location) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.todayDate = new Date()
    this.searchFormVAlue()
    this.getViewData()

    this.editUserForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
    })

    this.sendNotificationForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required]),

    })
    this.allSendNotificationForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required]),

    })


  }

  notificationFun(data){
    this.notificationType=data
  }

  Changed(event) {
    if (event) {
      this.nowDate2 = event;
    }
    else {
      this.nowDate2 = ''
    }
  }
  searchFormVAlue() {
    this.searchForm = new FormGroup({
      search: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl('')
    })
  }

  pagination(event) {
    this.pageNumber = event
    this.getViewData()
  }

  getViewData() {

    let apireq = {
      "limit":this.limit,
      "pageNumber": this.pageNumber,
    }

    this.spinner.show();
    this.service.postApiWithAuth('/api/v1/user/userList', apireq, 1).subscribe((success: any) => {
      if (success.status == 200) {
        this.spinner.hide();
        this.searchForm.reset()
        this.userArr = success.data;
        this.limit = success.data.limit;
        this.total = success.data.total;
        this.srNumber = (this.pageNumber - 1) * 10;
      }
      else {
        this.spinner.hide();
        this.service.err("Something went wrong")
      }
    }, error => {
      this.spinner.hide();
      this.service.err("Something went wrong")
    })
  }



  fromMaxDate(event) {
    if (event) {
      this.todayDate = new Date(event)
    } else {
      this.todayDate = new Date()
    }
  }

  search(data) {

    let apireq = {
      "limit":this.limit,
      "pageNumber": this.pageNumber,
      "search": data.search,
      "startDate": (data.startDate == '' || data.startDate == undefined) ? '' : (new Date(data.startDate).toISOString()),
      "endDate": (data.endDate == '' || data.endDate == undefined) ? '' : (new Date(new Date(data.endDate).getTime() + 24 * 60 * 60 * 1000).toISOString()),
    }

    this.service.postApiWithAuth('/api/v1/adminUser/userList', apireq, 1).subscribe((success: any) => {
      if (success.status == 200) {
        this.spinner.hide();
        this.userArr = success.data.docs;
        this.limit = success.data.limit;
        this.total = success.data.total;
        this.srNumber = (this.pageNumber - 1) * 10;
      }
      else {
        this.spinner.hide();
        this.service.err("Something went wrong")
      }
    }, error => {
      this.service.err("Something went wrong")
    })
  }

  delete(X) {
    this.id = X._id;
  }

  deleteApi() {

    let deleteData = {
      "userId": this.id,
    }

    this.service.postApiWithAuth("/api/v1/adminUser/deleteUser", deleteData, 1).subscribe((data: any) => {
      if (data.status == 200) {
        this.service.succ(data.message);
        this.getViewData()
      } else {
        this.service.err("Something went wrong")
      }
    })
  }

  changeStatus(id,status) {
    this.id = id;
    this.status=status
  }

  changeStatusApi() {

    let apireq = {
      "userId": this.id,
      status:this.status
    }

    this.service.postApiWithAuth('/api/v1/adminUser/updateUserStatus', apireq, 1).subscribe((success: any) => {

      if (success.status == 200) {
        this.getViewData()
        this.service.succ(success.message)
      }
      else {
        this.service.err("Something went wrong")
      }
    }, error => {
      this.service.err("Something went wrong")
    })
  }

  openModal(id, userId) {
    this.userId = userId
    $('#' + id).modal({ backdrop: 'static', keyboard: false });
  }

  changeDate() {
    this.dateValue = new Date(this.searchForm.value.formDate)

  }

  sendNotification(id) {
    this.id = id;
  }
  sendNotification3(data) {

    if (this.sendNotificationForm.invalid) {
      return
    }
    $('#sendNotification').modal('hide')

    let apireq = {
      userId: this.id,
      title: data.title,
      message: data.message,
    }

    this.service.postApiWithAuth('/api/v1/adminUser/sendNotification', apireq, 1).subscribe(success => {
      if (success.status == 200) {
        this.service.succ(success.message);
        this.sendNotificationForm.reset();
        $('#sendNotification').modal('hide')
      } else {
        $('#sendNotification').modal('hide')
        this.service.err(success.message);
      }
    }, error => {
      $('#sendNotification').modal('hide')
      this.service.err("Something went wrong")
    })
  }

  allSendNotification(data) {

    if (this.allSendNotificationForm.invalid) {
      return
    }
    $('#allSendNotification').modal('hide')

    let apireq = {
      "limit":this.limit,
      "pageNumber": this.pageNumber,
      title: data.title,
      message: data.message,
      type:'All'
    }

    this.spinner.show();
    this.service.postApiWithAuth('/api/v1/adminUser/sendNotification', apireq, 1).subscribe((success: any) => {
      if (success.status == 200) {
        this.spinner.hide()
        this.service.succ(success.message)
        this.allSendNotificationForm.reset()
        $('#allSendNotification').modal('hide')
      }
      else {
        this.allSendNotificationForm.reset()
        $('#allSendNotification').modal('hide')
        this.spinner.hide();
        this.service.err("Something went wrong")
      }
    }, error => {
      this.spinner.hide();
      this.service.err("Something went wrong")
    })
  }



  cancelModal() {
    this.sendNotificationForm.controls['title'].setValue(null)
    this.sendNotificationForm.controls['message'].setValue(null)
    this.mailForm.controls['message'].setValue(null)
    this.editUserForm.reset();
    this.submitted = false
  }


  reset() {
    this.sendNotificationForm.controls['title'].setValue(null)
    this.sendNotificationForm.controls['message'].setValue(null)
    this.mailForm.controls['message'].setValue(null)
    this.editUserForm.reset();
    this.submitted = false
  }

  backClicked() {
    this._location.back();
  }



}

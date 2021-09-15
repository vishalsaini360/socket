import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
declare var $: any

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit {
  roomArr: any = [];
  pageNumber = 1;
  srNumber: any;
  loginUserName:any;
  constructor(public service: AppService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private _location: Location) { }

  ngOnInit(): void {
    this.getViewData()
    this.loginUserName=localStorage.getItem('name')
  }

  getViewData() {

    let apireq = {
      
    }

    this.spinner.show();
    this.service.postApiWithAuth('/api/v1/user/roomList', apireq, 1).subscribe((success: any) => {
      if (success.status == 200) {
        this.spinner.hide();
        this.roomArr = success.data;
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

}

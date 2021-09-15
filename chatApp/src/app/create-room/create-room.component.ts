import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
declare var $: any

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {
  allSendNotificationForm: FormGroup;
  constructor(public service: AppService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private _location: Location) { }

  ngOnInit(): void {
    this.allSendNotificationForm = new FormGroup({
      title: new FormControl('', [Validators.required])
    })
  }

  allSendNotification(data) {
    console.log(data)
    if (this.allSendNotificationForm.invalid) {
      return
    }
    let apireq = {
      name: data.title,
    }
    this.spinner.show();
    this.service.postApiWithAuth('/api/v1/user/createRoom', apireq, 1).subscribe((success: any) => {
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


  backClicked() {
    this._location.back();
  }
  

}

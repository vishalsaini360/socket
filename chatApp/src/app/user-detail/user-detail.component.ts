import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  id: any;
  userDetail: any;

  constructor(
    public router : Router,
    private activatedRoute: ActivatedRoute,
    public service :AppService) { }

  ngOnInit() {
    this.getId()
    this.getUserData()
  }

  getId(){
    this.activatedRoute.params.subscribe(paramsId => {
      this.id = paramsId.id;
    });
  }

  getUserData(){
    let apireq={
      userId : this.id
    }
    this.service.postApi('/api/v1/adminUser/getUserDetail',apireq,0).subscribe((success)=>{
      if(success.status==200){
        this.userDetail = success.data
      }
      else{
        console.log(success.response_message)
      }
    },error=>{
      console.log("Something went wrong")
    })
  }

}

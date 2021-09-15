import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
declare var $

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  data: any;
  userData: any;

  constructor(
    public service: AppService) { }

  ngOnInit() {
    this.getDataApi()
    this.adminData()
    $.fn.jQuerySimpleCounter = function( options ) {
      var settings = $.extend({
          start:  0,
          end:    100,
          easing: 'swing',
          duration: 400,
          complete: ''
      }, options );
  
      var thisElement = $(this);
  
      $({count: settings.start}).animate({count: settings.end}, {
      duration: settings.duration,
      easing: settings.easing,
      step: function() {
        var mathCount = Math.ceil(this.count);
        thisElement.text(mathCount);
      },
      complete: settings.complete
    });
  };
  }

  getDataApi() {
   
    this.service.getApiWithAuth("/api/v1/admin/dashboardCount").subscribe((success:any) => {
      if (success.status == 200) {
        this.data = success.data;
        $('#number1').jQuerySimpleCounter({end:this.data.totalUser,duration: 3000});
        $('#number2').jQuerySimpleCounter({end:this.data.activeUser,duration: 3000});
        $('#number3').jQuerySimpleCounter({end:this.data.notification,duration: 3000});
      }
      else {
        console.log(success.message)
      }
    }, error => {
      console.log("Something went wrong")
    })
  }

  adminData() {

   
    this.service.getApiWithAuth('/api/v1/admin/getAdminDetail').subscribe((res: any) => {
      if (res.status == 200) {
        this.userData = res.data;
      }
    }, error => {
      console.log("Something went wrong")
    })
  }


}

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppService } from 'src/app/app.service'
declare var $: any

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  constructor( private route: Router,
    private service: AppService,
   ) { }

  ngOnInit(): void {
  }

  logout() {
    let apireq = {
      adminId: localStorage.getItem("_id")
    }
    this.service.postApi('/api/v1/admin/adminLogout', apireq, 0).subscribe((success:any) => {
      if (success.status == 200) {
        localStorage.clear()
        this.service.succ(success.message)
        this.route.navigate(['/'])
      }
      else {
        this.service.err("Something went wrong")
      }
    }, error => {
      this.service.err("Something went wrong")

    })
  }
}

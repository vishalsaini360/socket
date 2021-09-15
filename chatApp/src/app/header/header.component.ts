import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppService } from 'src/app/app.service'
declare var $: any

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  name=localStorage.getItem("name")
  profilePic=localStorage.getItem("profilePic")
  constructor(
    private route: Router,
    private service: AppService
  ) { }

  ngOnInit(): void {
  }

  logout() {
    let apireq = {
      adminId: localStorage.getItem("_id")
    }
    this.service.postApi('/api/v1/admin/adminLogout', apireq, 0).subscribe((success:any) => {
      if (success.status == 200) {
        this.service.succ(success.message)
        localStorage.clear()
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

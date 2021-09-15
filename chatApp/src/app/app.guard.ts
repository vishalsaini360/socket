import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppGuard implements CanActivate {
  constructor(
    private router: Router,
    private service: AppService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('token') != null && localStorage.getItem('_id').length==24) {
      return true;          
    }
    else{
      this.service.err("You don't have permission to access this page")
      this.router.navigate(['/']);
      return false;
    }

  }  
}

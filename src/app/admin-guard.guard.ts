import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './shared/services/authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      let profile = AuthService.getUserData();
      if (profile && profile.user && profile.user.role == "admin") {
        // logged in admin so return true
        return true;
    }

    // Logout and login page with the return url
    AuthService.logout();
    this.router.navigate(['/login']);
    return false;
  }
}

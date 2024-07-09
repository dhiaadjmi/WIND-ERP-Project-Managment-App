import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree,Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const userRole = this.authService.getRole();
    const roles = (next.data as any)?.roles;

    if (userRole && roles && roles.includes(userRole.toUpperCase())) {
      return true;
    } else {
      this.router.navigate(['/authentication/unauthorized']);
      return false;
    }
  }

}

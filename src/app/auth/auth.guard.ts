import { AuthService } from "./auth.service";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
@Injectable()
export class AuthGuard implements CanActivate {
  private isAuthenticated: boolean = false;
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    this.authService.getAuthStausListenner().subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
    });
    if (!this.isAuthenticated) {
      this.router.navigate(["/auth/login"]);
    }
    return this.isAuthenticated;
  }
}

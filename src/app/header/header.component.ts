import { Subscription } from "rxjs";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private authSub: Subscription;
  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.authSub = this.authService
      .getAuthStausListenner()
      .subscribe((isAuth) => {
        this.isAuthenticated = isAuth;
      });
  }

  onLogout(){
    this.authService.logout()
  }
  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}

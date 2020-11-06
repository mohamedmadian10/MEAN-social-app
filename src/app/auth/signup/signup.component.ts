import { Router } from "@angular/router";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  authStatusSub: Subscription;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStausListenner()
      .subscribe((isAuth) => {
        this.isLoading = false;
      });
  }

  onSignup(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.isLoading = true;
    this.authService.registerUser(form.value.email, form.value.password);
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}

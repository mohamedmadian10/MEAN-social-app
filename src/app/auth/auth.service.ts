import { Router } from "@angular/router";
import { BehaviorSubject, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";
import { environment } from "../../environments/environment";

const baseUrl = environment.apiUrl + "user/";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private token: string;
  private tokenTimer: NodeJS.Timer;
  private userId: string;
  private authSatusListenner = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStausListenner() {
    return this.authSatusListenner.asObservable();
  }
  //register user
  registerUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http
      .post<{ message: string; authData: AuthData }>(
        baseUrl + "signup",
        authData
      )
      .subscribe(
        (user) => {
          this.router.navigate(["/"]);
          // console.log(user);
        },
        (error) => {
          this.authSatusListenner.next(false);
        }
      );
  }

  //login
  login(email: string, password: string) {
    const authData: AuthData = { email, password };
    return this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        baseUrl + "login",
        authData
      )
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          this.userId = response.userId;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            // console.log(expirationDate);
            this.saveAuthData(token, expirationDate, this.userId);

            this.authSatusListenner.next(true);
            this.router.navigate(["/"]);
          }
        },
        (error) => {
          this.authSatusListenner.next(false);
        }
      );
  }

  // this methode to save auth state wehen user reload the app
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authSatusListenner.next(true);
    }
  }

  //logout
  logout() {
    this.token = null;
    this.userId = null;
    this.authSatusListenner.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/auth/login"]);
  }

  //setting timer for token
  private setAuthTimer(duration: number) {
    // console.log("setting timer :+", duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  //store data in local storage
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }
  //get data from local storage
  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }
  //clear data from local storage
  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }
}

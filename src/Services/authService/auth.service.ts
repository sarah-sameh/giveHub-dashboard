import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {



  userData: any;

  accountType: string | null = null;

  constructor(private _HttpClient: HttpClient, private _Router: Router) { }


  setRegister(userData: any): Observable<any> {
    return this._HttpClient.post(`https://localhost:44377/api/Account/Admin-register`, userData);

  }

  setLogIn(userData: any): Observable<any> {
    this.loggedIn.next(true);
    return this._HttpClient.post(`https://localhost:44377/api/Account/log-in`, userData)
  }

 

  decodeUserData(): void {
    const token = localStorage.getItem('Token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.userData = decodedToken;
        console.log('Decoded token:', decodedToken);
         let userId = this.getUserId();
      let userAccountType = this.getUserAccountType();
      console.log(userId);
      console.log(userAccountType);
      } catch (error) {
        console.error('Invalid token:', error);
      }
    } else {
      console.error('No token found in localStorage.');

    }
  }

  getUserId(): string | null {
    const token = localStorage.getItem('Token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
    }
    return null;
  }

  getUserAccountType(): string | null {
    const token = localStorage.getItem('Token');
    if (token) {

     // const decodedToken: JwtPayload & { [key: string]: any } = jwtDecode(token);
      
      const decodedToken: any = jwtDecode(token);
      return decodedToken["AccountType"] || null;
console.log(token);
    }
    return null;
  }

  logOut(): void {
    localStorage.removeItem('Token');
    this._Router.navigate(['/login']);
    this.loggedIn.next(false);
  }
  private loggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }



}

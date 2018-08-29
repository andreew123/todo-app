import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {
  private httpOptions: object;
  private apiPrefixUrl: string = 'http://127.0.0.1:8000/';

  authStatus: EventEmitter<any> = new EventEmitter();

  constructor(private httpClient: HttpClient) {
  }

  login(loginValues: Array<any>) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return this.httpClient.post<any>(`${this.apiPrefixUrl}api/login`, loginValues, this.httpOptions)
      .pipe(map(response => {
        console.log('response', response);
        if (response && response['token']) {
          localStorage.setItem('token', response['token']);
          this.authStatus.emit(true);
        }

        return response;
      }))
  }

  signup(signupValues: Array<any>) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return this.httpClient.post<any>(`${this.apiPrefixUrl}api/signup`, signupValues, this.httpOptions)
      .pipe(map(response => {
        console.log('response', response);
        if (response && response['token']) {
          localStorage.setItem('token', response['token']);
          this.authStatus.emit(true);
        }

        return response;
      }))
  }

  logout() {
    const token = localStorage.getItem('token');

    this.httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
      })
    };

    return this.httpClient.get<any>(`${this.apiPrefixUrl}api/logout`, this.httpOptions)
      .pipe(map(response => {
        if (response.success) {
          localStorage.removeItem('token');
          this.authStatus.emit(false);
          return true;
        } else {
          return false;
        }
      }))
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('token'))
      return true;
    else
      return false;
  }

}

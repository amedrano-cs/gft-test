import { API } from '../config/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginInterface, RegistrationInterface } from '../models/auth';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';

const TOKEN = 'token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private storage: Storage) { }

  /**
   * @description Validates if user has a valid saved token
   * @returns Boolean user logged in Promise
   */
  async isUserLoggedIn(): Promise<any> {
    return this.storage.get(TOKEN).then(token => {
      if (token !== null) {
        const helper = new JwtHelperService();
        const isExpired = helper.isTokenExpired(token);

        return !isExpired;
      } else {
        return false;
      }
    });
  }

  /**
   * @description Logins user with provided credentials
   * @returns http observable with api response
   */
  login(loginData: LoginInterface): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'content-type': 'application/json' })
    };
    return this.http.post<any>(API.uri + 'auth/user/authenticate', loginData, httpOptions);
  }

  /**
   * @description Registers new user with provided data
   * @returns http observable with api response
   */
  register(registrationData: RegistrationInterface): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'content-type': 'application/json' })
    };

    return this.http.post<any>(API.uri + 'auth/user/create', registrationData, httpOptions);
  }

  /**
   * @description Retrieves token from storage if theres one
   * @returns Decoded token promise
   */
  async retrieveToken(): Promise<any> {
    return this.storage.get(TOKEN).then(token => {
      if (token !== null) {
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(token);

        return decodedToken;
      }
    });
  }

  /**
   * @description Saves token info. to storage for future usage
   * @param token Token to save to storage
   */
  setToken(token: string) {
    this.storage.set(TOKEN, token);
  }
}

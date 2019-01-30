import { API } from '../config/api';
import { AccountRequest } from '../models/account-request';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient, private storage: Storage) { }

  /**
   * @description Gets current user's account list
   * @param token Original jwt token
   * @returns Account list observable
   */
  getUserAccounts(token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'content-type': 'application/json', 'x-access-token': token })
    };

    return this.http.get<any>(API.uri + 'accounts', httpOptions);
  }

  /**
   * @description Gets cards catalog from api
   * @param token Original jwt token
   * @returns Catalog observable
   */
  getCardsCatalog(token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'content-type': 'application/json', 'x-access-token': token })
    };

    return this.http.get<any>(API.uri + 'catalogs/cards', httpOptions);
  }

  /**
   * @description Sends new account request to api
   * @param accountRequest Account request data
   * @param token Original jwt token
   */
  requestNewAccount(accountRequest: AccountRequest, token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'content-type': 'application/json', 'x-access-token': token })
    };

    return this.http.post<any>(API.uri + 'accounts', accountRequest, httpOptions);
  }
}

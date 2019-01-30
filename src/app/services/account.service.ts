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
   * @returns Account list observable
   */
  getUserAccounts(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'content-type': 'application/json', 'x-access-token': API.xAccessToken })
    };

    return this.http.get<any>(API.uri + 'accounts', httpOptions);
  }

  /**
   * @description Gets cards catalog from api
   * @returns Catalog observable
   */
  getCardsCatalog(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'content-type': 'application/json', 'x-access-token': API.xAccessToken })
    };

    return this.http.get<any>(API.uri + 'catalogs/cards', httpOptions);
  }

  /**
   * @description Sends new account request to api
   * @param accountRequest Account request data
   */
  requestNewAccount(accountRequest: AccountRequest): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'content-type': 'application/json', 'x-access-token': API.xAccessToken })
    };

    return this.http.post<any>(API.uri + 'accounts', accountRequest, httpOptions);
  }
}

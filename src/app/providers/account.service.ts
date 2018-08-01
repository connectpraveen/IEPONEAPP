import { Injectable } from '@angular/core';
import { Account } from './account';
import { AccountDetails } from './account';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpParams } from '@angular/common/http';
import { Http, Response, RequestOptions, RequestOptionsArgs, Headers } from '@angular/http';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { map } from 'rxjs/operators';
import { SharedDataService } from '../shared/shared-data.service';
import { HttpHeaders } from '@angular/common/http';
import { pipe } from '../../../node_modules/@angular/core/src/render3/pipe';

@Injectable()
export class AccountService {
  private servletUrl;private localservletUrl;headers: any;
  options: RequestOptions;
  
  constructor(private http: Http, private _http: HttpClient, private shareSer: SharedDataService, private _firebaseDbContext: AngularFireDatabase) {
    this.servletUrl = shareSer.getServletUrl();
    this.localservletUrl = shareSer.getlocalServletUrl();
  }


  /* Register account details */
  insertAccount(email, password): Observable<Account> {
    let acc = { 'email': email, 'password': password, 'action': 'register' };
    return this._http.get<Account>(this.servletUrl + 'GetAccount?' + JSON.stringify(acc)).pipe(map(data => {
      return <Account>data;
    }));
  }


  /* Sign in to account*/
  signInAccount(email, password): Observable<number> {
    let acc = { 'email': email, 'password': password, 'action': 'signin' };
    return this._http.get<number>(this.servletUrl + 'GetAccount?' + JSON.stringify(acc)).pipe(map(data => {
      return <number>data;
    }));
  }



  /* get the account details given email id*/
  getAccount(email): Observable<Account> {
    let acc = { 'email': email, 'password': '', 'action': 'find' };
    return this._http.get<Account>(this.servletUrl + 'GetAccount?' + JSON.stringify(acc)).pipe
      (map(data => {
        return <Account>data;
      }));
  }

  /*************AFTER FIREBASE*************** */

  saveAccountWithEmail(email, uid) {
    let acc = { 'email': email, 'uid': uid, 'action': 'save-email' };
    return this._http.get<string>(this.servletUrl + 'GetUserAccount?' + JSON.stringify(acc)).pipe(map(data => {
      return <string>data;
    }));
  }

  saveAccountWithPhone(phone, uid) {
    let acc = { 'uid': uid, 'phone': phone, 'action': 'save-phone' };
    return this._http.get<string>(this.servletUrl + 'GetUserAccount?' + JSON.stringify(acc)).pipe(map(data => {
      return <string>data;
    }));
  }

  saveAccount(email,phone,uid,ip,provider){
    let acc = { 'uid': uid,'email': email, 'phone_number': phone, 'action': 'add','ip_address':ip,'service_provider':provider };
    return this._http.get<string>(this.localservletUrl + 'Account?' + JSON.stringify(acc)).pipe(map(data => {
      return <string>data;
    }));
  }

  saveAccountWithName(name, uid) {
    let acc = { 'uid': uid, 'name': name, 'action': 'save-name' };
    return this._http.get<string>(this.servletUrl + 'GetUserAccount?' + JSON.stringify(acc)).pipe(map(data => {
      return <string>data;
    }));
  }

  /* function to update the email id */
  updateEmail(uid, email): Observable<number> {
    let acc = { 'email': email, 'uid': uid, 'action': 'update-email' };
    return this._http.get<number>(this.servletUrl + 'GetUserAccount?' + JSON.stringify(acc)).pipe(map(data => {
      return <number>data;
    }));
  }

  /* function to update the phone number */
  updatePhone(phone, uid): Observable<number> {
    let acc = { 'uid': uid, 'phone': phone, 'action': 'update-phone' };
    return this._http.get<number>(this.servletUrl + 'GetUserAccount?' + JSON.stringify(acc)).pipe(map(data => {
      return <number>data;
    }));
  }

  /* insert user into Subscriber */
  signOutAccount(uid): Observable<number> {
    let acc = { 'uid': uid, 'action': 'sign-out' };
    return this._http.get<number>(this.servletUrl + 'GetUserAccount?' + JSON.stringify(acc)).pipe(map(data => {
      return <number>data;
    }));
  }

  /* get the account details given email id*/
  getAccountfromUID(uid): Observable<string> {
    let acc = { 'uid': uid, 'action': 'find' };
    return this._http.get<string>(this.servletUrl + 'GetUserAccount?' + JSON.stringify(acc))
      .pipe(map(data => {
        return <string>data;
      }));
  }

  getAccountDetails(id): Observable<AccountDetails[]> {
    let acc = { 'account_id': id, 'action': 'fetch-details' };
    return this._http.get<AccountDetails[]>(this.localservletUrl + 'Account?' + JSON.stringify(acc)).pipe
     (map(data => {
        return <AccountDetails[]>data;
      }));
  }

  register(email): Observable<string> {
    let acc = { 'uid': '', 'email': email, 'action': 'register' };
    return this._http.get<string>(this.servletUrl + 'GetUserAccount?' + JSON.stringify(acc)).pipe
      (map(data => {
        return <string>data;
      }));
  }

  AddAssociatedEmailPhone(email, phone, password, uid): Observable<string> {
    let acc = { 'uid': '', 'email': email, 'action': 'register' };
    return this._http.get<string>(this.servletUrl + 'GetUserAccount?' + JSON.stringify(acc))
      .pipe(map(data => {
        return <string>data;
      }));
  }

  sendEmail(email){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'my-auth-token'
      })
    };
    let acc = { 'email': email };
    /*return this._http.post<string>("http://localhost:8080/" + 'Account?' + JSON.stringify(acc))
      .map(data => {
        return <string>data;
      });*/

      return this.http.post("https://iepone-qa-mailer-server.appspot.com/"+ 'Account?'+ JSON.stringify(acc),email)
   .pipe(map(data => {
      return ;
    }));
  }



}

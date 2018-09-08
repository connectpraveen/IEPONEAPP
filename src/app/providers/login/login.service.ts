import { Injectable } from '@angular/core';
import { Login } from './login';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpParams } from '@angular/common/http';
import { Http, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { map } from 'rxjs/operators';
import { SharedDataService } from '../../shared/shared-data.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class LoginService {
  private servletUrl;
   constructor(private http: Http, private _http: HttpClient, private shareSer: SharedDataService) {
    this.servletUrl = shareSer.getServletUrl();
}

  
  /* add login details to Platform login history table */
  addLoginDetails(id, ip, session, login_id, login_service_provider)  {
    let login = {'account_id': id, 'ip_address': ip, 'session_val': session,'login_id':login_id, 'login_service_provider': login_service_provider,
   'action': 'add'};
    return this._http.get<Boolean>(this.servletUrl + 'Login?' + JSON.stringify(login) ).pipe(map(data => {
             return <Boolean>data; }));
  }
    
  /* fetch user login details */
   getLoginDetails(id): Observable<Login[]> {      
     return this._http.get<Login[]>(this.servletUrl + 'loginHistory/' + id).pipe(map(data => {
             return <Login[]>data; }));
  }
  getAccountHolders(id): Observable<any[]> {      
    return this._http.get<any[]>(this.servletUrl + 'accountHolders/' + id).pipe(map(data => {
            return <any[]>data; }));
 }
deleteAccountHolders(id) {      
  return this._http.delete(this.servletUrl + 'accountHolders/' + id).pipe(map(data => {
          return data; }));
}

addAccountHolders(account_id,accountHolderId) { 
  let acc_object={
    "accountId": account_id,
    "identityProvider": "Firebase",
    "accountHolderId": accountHolderId,
    "verification": "Not Verified",
    "correspondence": "",
    "profileAccess": "0",
    "associationType": "Secondary",
    "message": "",
    "userUpdated": "admin"
}
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'        
  })
};
  return this._http.post(this.servletUrl + 'accountHolder', acc_object, httpOptions).pipe(map(data => {    
    return data;

  }));
}

  getIpCliente(): Observable<string> {
      return this.http.get('https://api.ipify.org/?format=jsonp&callback=JSONP_CALLBACK') // ...using post request '
      .pipe(map((res: Response) => {
                              let ipVar = res.text();
                              let num = ipVar.indexOf(":");
                              let num2 = ipVar.indexOf("\"});");
                              ipVar = ipVar.slice(num + 2, num2);                             
                              return ipVar}));
  
}
}

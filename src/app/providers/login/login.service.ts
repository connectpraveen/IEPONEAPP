import { Injectable } from '@angular/core';
import { Login } from './login';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpParams } from '@angular/common/http';
import { Http, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { map } from 'rxjs/operators';
import { SharedDataService } from '../../shared/shared-data.service';

@Injectable()
export class LoginService {
  private servletUrl;
   constructor(private http: Http, private _http: HttpClient, private shareSer: SharedDataService) {
    this.servletUrl = shareSer.getServletUrl();
}

  
  /* add login details to Platform login history table */
  addLoginDetails(id, ip, session, permission, datetime)  {
    let login = {'account_id': id, 'ip_address': ip, 'session_val': session, 'permission': permission,
      'last_login': datetime, 'action': 'add'};
    return this._http.get<Boolean>(this.servletUrl + 'GetLogin?' + JSON.stringify(login) ).pipe(map(data => {
             return <Boolean>data; }));
  }
    
  /* fetch user login details */
   getLoginDetails(id): Observable<Login[]> {
      let login = {'account_id': id, 'ip_address': '', 'session_val': '', 'permission': '',
      'last_login': '', 'action': 'fetch'};
     return this._http.get<Login[]>(this.servletUrl + 'GetLogin?' + JSON.stringify(login)).pipe(map(data => {
             return <Login[]>data; }));
  }
  
  getIpCliente(): Observable<string> {
      return this.http.get('https://api.ipify.org/?format=jsonp&callback=JSONP_CALLBACK') // ...using post request '
      .pipe(map((res: Response) => {console.log('res ', res);
                              console.log('res.json() ', res.text());
                              console.log('parseado  stringify ', JSON.stringify(res.text()));
                              let ipVar = res.text();
                              let num = ipVar.indexOf(":");
                              let num2 = ipVar.indexOf("\"});");
                              ipVar = ipVar.slice(num + 2, num2);
                              console.log('ipVar -- ', ipVar);
                              return ipVar}));
  
}
}

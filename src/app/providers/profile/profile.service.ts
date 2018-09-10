import { Injectable } from '@angular/core';
import { Profile } from '../subscription/subscription';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpParams } from '@angular/common/http';
import { Http, Response, RequestOptions, RequestOptionsArgs, Headers } from '@angular/http';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { map } from 'rxjs/operators';
import { SharedDataService } from '../../shared/shared-data.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class ProfileService {
  private servletUrl;
  constructor(private http: Http, private _http: HttpClient, private shareSer: SharedDataService, private _firebaseDbContext: AngularFireDatabase) {
    this.servletUrl = shareSer.getServletUrl();
  }

  getProfiles(id) {
    
    return this._http.get<Profile[]>(this.servletUrl + 'profilesForAccountId/' + id)
      .pipe(map(data => {
        return data;
      }));
  }

  SaveProfile(account_id,age,gender){
    var uniq=new Date().getTime();
    let profile ={
    "userUpdated": "admin",
    "accountId": account_id,
    "profileId": "PRO"+uniq,
    "deviceId": "",
    "companionId": "",
    "status": "Active",
    "message": "Added from web UI",
    "age":age,
    "gender":gender
  }

  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'        
    })
  };
  return this._http.post(this.servletUrl + 'profiles', profile, httpOptions).pipe(map(data => {    
    return data;
  })); 
  }


}

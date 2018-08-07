import { Injectable } from '@angular/core';
import { Profile } from '../subscription/subscription';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpParams } from '@angular/common/http';
import { Http, Response, RequestOptions, RequestOptionsArgs, Headers } from '@angular/http';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { map } from 'rxjs/operators';
import { SharedDataService } from '../../shared/shared-data.service';

@Injectable()
export class ProfileService {
  private servletUrl;
  constructor(private http: Http, private _http: HttpClient, private shareSer: SharedDataService, private _firebaseDbContext: AngularFireDatabase) {
    this.servletUrl = shareSer.getServletUrl();
  }

  getProfiles(id): Observable<Profile[]> {
    let profile = { 'account_id': id, 'action': 'fetch' };
    return this._http.get<Profile[]>(this.servletUrl + 'Profile?' + JSON.stringify(profile))
      .pipe(map(data => {
        return <Profile[]>data;
      }));
  }

  associateProfile(id,profileIds){
    let profile = { 'account_id': id,'profile_ids': profileIds, 'action': 'associate-profiles' };
    return this._http.get(this.servletUrl + 'GetProfile?' + JSON.stringify(profile))
      .pipe(map(data => {
        return data;
      }));
  }

}

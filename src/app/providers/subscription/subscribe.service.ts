import { Injectable } from '@angular/core';
import { Subscription, Profile } from './subscription';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpParams } from '@angular/common/http';
import { Http, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { SharedDataService } from '../../shared/shared-data.service';

@Injectable()
export class SubscribeService {
  private servletUrl;
  constructor(private http: Http, private _http: HttpClient, private shareSer: SharedDataService) {
    this.servletUrl = shareSer.getServletUrl();
  }

  getIfSubscribed(id): Observable<Subscription> {
    let subscribe = { 'account_id': id, 'action': 'fetch' };
    return this._http.get<Subscription>(this.servletUrl + 'GetSubscription?' + JSON.stringify(subscribe))
      .pipe(map(data => {
        return <Subscription>data;
      }));
  }



  insertSubscription(account_id, startDate, endDate,payment,cost): Observable<Subscription> {
    let subscribe = { 'account_id': account_id, 'startDate': startDate, 'endDate': endDate,'payment':payment,'cost':cost, 'action': 'add' };
    return this._http.get<Subscription>(this.servletUrl + 'GetSubscription?' + JSON.stringify(subscribe))
      .pipe(map(data => {
        return <Subscription>data;
      }));
  }

  insertManySubscription(account_id, quantity): Observable<String> {
    let subscribe = { 'account_id': account_id, 'quantity': quantity, 'action': 'add-many' };
    return this._http.get<String>(this.servletUrl + 'GetSubscription?' + JSON.stringify(subscribe))
      .pipe(map(data => {
        debugger;
        return <String>data;
      }));
  }

  getallSubscriptions(id): Observable<Subscription[]> {
    let subscribe = { 'account_id': id, 'action': 'fetch-all' };
    return this._http.get<Subscription[]>(this.servletUrl + 'GetSubscription?' + JSON.stringify(subscribe))
      .pipe(map(data => {
        return <Subscription[]>data;
      }));
  }


  updateSubscription(id, subsCode): Observable<number> {
    let subscribe = { 'account_id': id, 'subscription-code': subsCode, 'action': 'update' };
    return this._http.get<number>(this.servletUrl + 'GetSubscription?' + JSON.stringify(subscribe))
      .pipe(map(data => {
        return <number>data;
      }));
  }
  getProfiles1(id): Profile[] {
    var profiles: Profile[] = [];
    profiles.push(new Profile("4376eSHY676", "Cuddles","10","Male","3rd Aug","YES"));
    profiles.push(new Profile("4376eSHY677", "Nibbles","12","Male","5th Aug","NO"));
    return profiles;
  }
}

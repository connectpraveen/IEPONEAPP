import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class SharedDataService {

  /* variable holding the social profile with which the user has logged in */
  private show = 'none';
  private orderId = 'none';
  private verlink = 'none';
  private userEmail = 'none';
  private clientVerifyURL=' https://iepone-qa-account-web.appspot.com/';
  private serverMailerURL='https://iepone-qa-account-payserver.appspot.com/';
  //private servletUrl = 'https://iepone-account-server.appspot.com/';
  private servletUrl = 'https://iepone-qa-account-server.appspot.com/';
  //private servletUrl = 'http://qa-service-iepone.appspot.com/';
   //private localservletUrl = 'http://localhost:8080/';

   private localservletUrl = 'https://iepone-qa-account-server.appspot.com/';
  //private servletUrl = 'http://192.168.99.100:8080/';
  //private api_url = 'http://35.227.24.81:9000/';
  //private api_url = 'http://localhost:9000/';
  private uid = 'none';
  private phone = 'none';

  private auth = { uid: '', value: '', provider: '', parentId: '' };

  /* event to display template based on show */
  showPageEvent: EventEmitter<string> = new EventEmitter<string>();

  /* Function to save the user email entered in registration*/
  saveuserEmail(userEmail: string) {
    this.userEmail = userEmail;
  }

  /* Function to get the user email entered in registration */
  getUserEmail(): string {
    return this.userEmail;
  }

  /* Function to save the verification link */
  saveVerificationLink(verlink: string) {
    debugger;
    this.verlink = verlink;
  }

  /* Function to get the verification link */
  getVerLink(): string {
    return this.verlink;
  }

  /* Function to save the linked social profile */
  savePage(show: string) {
    this.show = show;
  }

  /* Function to get the linked social profile */
  getPage(): string {
    return this.show;
  }

  /* Function to save the linked social profile */
  saveOrderId(orderId: string) {
    this.orderId = orderId;
  }

  /* Function to get the linked social profile */
  getOrderId(): string {
    return this.orderId;
  }

  getServletUrl(): string {
    return this.servletUrl;
  }

  getlocalServletUrl(): string {
    return this.localservletUrl;
  }
  getClientUrl(): string {
    return this.clientVerifyURL;
  }
  getNodeUrl(): string {
    return this.serverMailerURL;
  }
  saveUserUID(id) {
    this.uid = id;
  }

  getPhone(): string {
    return this.phone;
  }

  savePhone(phone) {
    this.phone = phone;
  }

  getUserUID(): string {
    return this.uid;
  }

  getAuth() {
    return this.auth;
  }

  saveAuth(uid, value, prov, parentId) {
    this.auth.uid = uid;
    this.auth.value = value;
    this.auth.provider = prov;
    this.auth.parentId = parentId;
  }

  clearAuth() {
    this.auth.uid = '';
    this.auth.value = '';
    this.auth.provider = '';
  }

  constructor() { }

}

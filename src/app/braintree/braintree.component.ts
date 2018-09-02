import { Component, OnInit } from '@angular/core';
import { AccountService } from '../providers/account.service';
import { Account } from '../providers/account';
import { LoginService } from '../providers/login/login.service';
import { Login } from '../providers/login/login';
import { SharedDataService } from '../shared/shared-data.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../providers/auth.service';
import { Subscription, Profile } from '../providers/subscription/subscription';
import { ProfileService } from '../providers/profile/profile.service';
import { DatePipe } from '@angular/common';
import { SubscribeService } from '../providers/subscription/subscribe.service';
import { UserAssociateEmail, UserAssociatePhone } from '../account/user-associate-email';
import { AccountEmailFirebaseService } from '../providers/firebase/account-email-firebase.service';
import { AccountGmailFirebaseService } from '../providers/firebase/account-gmail-firebase.service';

@Component({
  selector: 'app-braintree',
  templateUrl: './braintree.component.html',
  styleUrls: ['./braintree.component.scss'],
  providers: [AccountService, SharedDataService, LoginService, AuthService, SubscribeService, ProfileService, DatePipe]
})
export class BraintreeComponent implements OnInit {
  private currentUser: firebase.User;
  paymentResponse:any;
  authState: any = null;
  name:string;
    constructor(private accser: AccountService, private shared: SharedDataService,
    private logSer: LoginService, public afAuth: AngularFireAuth,
    private authService: AuthService, private profSer: ProfileService, private sharedService: SharedDataService, private subSer: SubscribeService,
    private datePipe: DatePipe, private accSer: AccountService, private accountEmailFirebaseService: AccountEmailFirebaseService,
    private accountGmailFirebaseService: AccountGmailFirebaseService) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
      this.currentUser = this.afAuth.auth.currentUser
    });
  }

  ngOnInit() {
    this.name= this.afAuth.auth.currentUser.displayName;
    
  }
  onPaymentStatus(response):void
  {
  this.paymentResponse=response;  
  }
}

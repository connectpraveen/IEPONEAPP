import { Component, OnInit } from '@angular/core';
import { AccountService } from '../providers/account.service';
import { Account } from '../providers/account';
import { LoginService } from '../providers/login/login.service';
import { Login } from '../providers/login/login';
import { SharedDataService } from '../shared/shared-data.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../providers/auth.service';
import { SlicePipe, Location } from '@angular/common';
import { environment } from '../../environments/environment';
import { User } from 'firebase';
import { PhoneNumber } from '../providers/phone/phone-number';
import { WindowService } from '../providers/phone/window.service';
import { DatePipe } from '@angular/common';
import { AccountEmailFirebaseService } from '../providers/firebase/account-email-firebase.service';
import { AccountGmailFirebaseService } from '../providers/firebase/account-gmail-firebase.service';
import { AccountPhoneFirebaseService } from '../providers/firebase/account-phone-firebase.service';
import * as firebase from 'firebase';
import { ActivatedRoute, Router, UrlSegment, ParamMap,Params } from '@angular/router';

@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.component.html',
  styleUrls: ['./verifyemail.component.scss'],
  providers: [AccountService, SharedDataService, LoginService, AuthService, WindowService, DatePipe]
})
export class VerifyemailComponent implements OnInit {
  authState: any = null;
  account_id:string;
  email:string;
  private currentUser: firebase.User;
  constructor(private activatedRoute: ActivatedRoute,private router: Router, private accser: AccountService, private shared: SharedDataService,
    private logSer: LoginService, public afAuth: AngularFireAuth,
    private authService: AuthService,
    private win: WindowService, private datePipe: DatePipe,
    private accountEmailFirebaseService: AccountEmailFirebaseService,
    private accountGmailFirebaseService: AccountGmailFirebaseService,
    private accountPhoneFirebaseService: AccountPhoneFirebaseService) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
      this.currentUser = this.afAuth.auth.currentUser
    });
  }

  ngOnInit() {
    this.account_id=localStorage.getItem("account_id");
    if (localStorage.getItem("account_id")) {
    console.log("Calling Verify");
    
    }
    this.activatedRoute.queryParams.subscribe((params: Params) => {
     this.email = params['email'];      
    });

    this.logSer.getAccountHolders(this.account_id).subscribe((data: any) => {
      data.accountHolders.forEach(element => {
        if (String(element.accountHolderId).indexOf("@") > 0) {
          if (element.associationType == "Primary") {
           if(element.accountHolderId==this.email)
           {
            this.UpdateVerify(element.id,this.account_id,element.accountHolderId,element.identityProvider);
           }
          }
        }      
      });
    });
  }
  UpdateVerify(id,account_id, accountHolderId,identityProvider)
  {
   this.accser.updateAccountHolder(id,account_id,identityProvider,accountHolderId).subscribe((data: any) => {  
  }, error => () => { }, () => { });
  }
}

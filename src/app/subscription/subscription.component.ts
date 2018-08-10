import { Component, OnInit } from '@angular/core';
import { AccountService } from '../providers/account.service';
import { Account } from '../providers/account';
import { LoginService } from '../providers/login/login.service';
import { Login } from '../providers/login/login';
import { SharedDataService } from '../shared/shared-data.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../providers/auth.service';
import { SubscribeService } from '../providers/subscription/subscribe.service';
import { Observable } from '../../../node_modules/rxjs';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css'],
  providers:[AccountService,SharedDataService,LoginService,AuthService,SubscribeService]
})
export class SubscriptionComponent implements OnInit {
  private currentUser: firebase.User;
  showSignout= false;
  accdata:Observable<any[]>;
  subscription:any;
  account_id:string;
  currentUsername: string; authState: any = null;
  constructor(private accser: AccountService, private shared: SharedDataService,
    private logSer: LoginService, public afAuth: AngularFireAuth, 
    private authService: AuthService, private subsciption:SubscribeService  ) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
      this.currentUser = this.afAuth.auth.currentUser
    });
  }
  ngOnInit() {    
    this.account_id = localStorage.getItem("account_id");
    if (this.afAuth.auth.currentUser) {    
      if (this.afAuth.auth.currentUser.displayName)      
      this.showSignout= true;         
      this.accdata= this.subsciption.getAccountDetails(this.account_id);
      this.accdata.forEach(element => {
        this.subscription=element[0].subscription[0];
        
      });
     
    }
  }


}

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
import {environment} from '../../environments/environment'
@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css'],
  providers:[AccountService,SharedDataService,LoginService,AuthService,SubscribeService]
})
export class SubscriptionComponent implements OnInit {
  clientTokenURL=environment.clientTokenURL;
  createPurchaseURL=environment.createPurchaseURL;
  subscriptionFound=false;
  chargeAmount=50.55;
  paymentResponse:any;
  private currentUser: firebase.User;
  showSignout= false;
  accdata:any;
  subscriptionData={
    "id": 3,
    "createdDate": "",
    "updatedDate": "",
    "userUpdated": "admin",
    "accountId": 9,
    "subscriptionCode": "",
    "subscriptionStartDate": "",
    "status": "",
    "totalPayment": 30,
    "freeDays": 55,
    "autoPayment": 0,
    "lastPayment": "",
    "nextPaymentDate": "",
    "priceId": 1,
    "discountId": 1
};
  account_id:string;
  currentUsername: string; authState: any = null;
  constructor(private accser: AccountService, private shared: SharedDataService,
    private logSer: LoginService, public afAuth: AngularFireAuth, 
    private authService: AuthService, private subsciptionsvc:SubscribeService  ) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
      this.currentUser = this.afAuth.auth.currentUser
    });
  }
  ngOnInit() {   
    
    this.account_id = localStorage.getItem("account_id");  
      this.showSignout= true;         
      this.getSubscription(); 
  }

  onPaymentStatus(response):void
  {
    this.subsciptionsvc.saveSubscriptionServlet(this.account_id,this.chargeAmount).subscribe((data: any) => {
      this.getSubscription();
     }, error => () => { }, () => { });      
  this.paymentResponse=response;  

  }
  
  getSubscription()
  {
    this.subsciptionsvc.getSubscriptionDetails(this.account_id)  
    .subscribe((data: any) => {
     if(data.data.length>0)
     {
      this.subscriptionFound=true;
     this.subscriptionData=data.data[0];
     }
    }, error => () => { }, () => { });    
  }
  getAutoPay()
  {
    return true;
  }
  getAutoPayOff()
  {
    return false;
  }
}

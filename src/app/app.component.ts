import { Component } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment, ParamMap,Params } from '@angular/router';
import { LoginService } from './providers/login/login.service';
import { AccountService } from './providers/account.service';
import { SharedDataService } from './shared/shared-data.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ SharedDataService,AccountService, LoginService]
})
export class AppComponent { 
  title:string;
  email:string;  
  account_id:string;
  constructor(private accser: AccountService,private logSer: LoginService,private activatedRoute: ActivatedRoute) {  
  }
  ngOnInit() {
    this.title = 'IEP ONE';

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.email = params['email'];             
      this.logSer.getAccountHolderAssociationType(this.email).subscribe((data: any) => {                
      this.UpdateVerify(data.id,data.accountId,data.accountHolderId,data.identityProvider,data.verification,data.correspondence,data.profileAccess,data.associationType);         
      });
     });     
   
  }
  UpdateVerify(id,account_id, accountHolderId,identityProvider,verification,correspondence,profileAccess,associationType)
  {    
   this.accser.updateAccountHolder(id,account_id,identityProvider,accountHolderId,"Verified",correspondence,profileAccess,associationType).subscribe((data: any) => {  
  }, error => () => { }, () => { });
  }
 
}



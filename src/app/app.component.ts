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
      this.account_id=params["acc"];     
      this.logSer.getAccountHolders(this.email).subscribe((data: any) => {
        data.accountHolders.forEach(element => {
          if (String(element.accountHolderId).indexOf("@") > 0) {        
             if(element.accountHolderId==this.email)
             {             
              this.UpdateVerify(element.id,this.account_id,element.accountHolderId,element.identityProvider,element.verification,element.correspondence,element.profileAccess,element.associationType);
             }          
          }      
        });
      });
     });     
   
  }
  UpdateVerify(id,account_id, accountHolderId,identityProvider,verification,correspondence,profileAccess,associationType)
  {    
   this.accser.updateAccountHolder(id,account_id,identityProvider,accountHolderId,"Verified",correspondence,profileAccess,associationType).subscribe((data: any) => {  
  }, error => () => { }, () => { });
  }
 
}



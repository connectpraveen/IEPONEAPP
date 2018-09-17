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
     });
     this.account_id=localStorage.getItem("account_id");     
     this.logSer.getAccountHolders(this.account_id).subscribe((data: any) => {
      data.accountHolders.forEach(element => {
        if (String(element.accountHolderId).indexOf("@") > 0) {
          if (element.associationType == "Primary") {
           if(element.accountHolderId==this.email)
           {
             console.log("calling verify");
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



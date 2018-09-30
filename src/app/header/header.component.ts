import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../shared/shared-data.service';
import { AccountService } from '../providers/account.service';
import { Account } from '../providers/account';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth'; 
import { AuthService } from '../providers/auth.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers:[AccountService,AngularFireAuth,SharedDataService]
})
export class HeaderComponent implements OnInit {
  showSignout= false;
  constructor(private sharedService: SharedDataService,private accser: AccountService,private router: Router,
    private authService: AuthService,public afAuth: AngularFireAuth) { }
  ngOnInit() {
    if(localStorage.getItem("account_id")!="0")
    this.showSignout = true;
    else 
    { 
      this.showSignout = false; 
      //this.router.navigate(['/login']);
    }
      
  }

  onSignOut(){
    let uid:string;
    localStorage.setItem("account_id","0");
    if(this.afAuth.auth.currentUser){
      uid=this.afAuth.auth.currentUser.uid
      this.authService.logout();
    }
      else{
          uid= this.sharedService.getAuth().uid;
          this.sharedService.clearAuth();
      }
      this.showSignout = false;
      this.router.navigate(['/login']);
    //window.location.href = 'https://iepone-qa-account-web.appspot.com/';
  }

}

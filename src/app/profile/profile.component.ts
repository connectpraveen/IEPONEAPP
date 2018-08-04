import { Component, OnInit } from '@angular/core';
import { AccountService } from '../providers/account.service';
import { Account } from '../providers/account';
import { LoginService } from '../providers/login/login.service';
import { Login } from '../providers/login/login';
import { SharedDataService } from '../shared/shared-data.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers:[AccountService,SharedDataService,LoginService,AuthService]
})
export class ProfileComponent implements OnInit {
  private currentUser: firebase.User;
  showSignout= false;
  currentUsername: string; authState: any = null;
  constructor(private accser: AccountService, private shared: SharedDataService,
    private logSer: LoginService, public afAuth: AngularFireAuth, 
    private authService: AuthService  ) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
      this.currentUser = this.afAuth.auth.currentUser
    });
  }
  ngOnInit() {    
    if (this.afAuth.auth.currentUser) {    
      if (this.afAuth.auth.currentUser.displayName)      
      this.showSignout= true;
    }
  }


}

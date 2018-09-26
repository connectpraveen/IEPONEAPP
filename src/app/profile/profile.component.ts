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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [AccountService, SharedDataService, LoginService, AuthService, SubscribeService, ProfileService, DatePipe]
})
export class ProfileComponent implements OnInit {
  private currentUser: firebase.User;
  showSignout = false;
  currentUsername: string; authState: any = null;
  eMail: string;
  showProfile = false;
  //Avatars: Avatar[];
  selectedBodystyle: string;
  avatarUrl = '';
  gender = 'Female';
  age = '5';
  avatarId = '0';
  showSuccess = false;
  profiles:any;
  currentAccount: Account;
  avatarUrls: String[] = [];
  order = 'avatar_id';
  profileCount = 0;
  currentAccountId = 'null'; auth: any
  public associatedEmailAddresses: UserAssociateEmail[];
  userAssociateEmailModel = {
    email: '',
    password: ''
  };
  account_id: string;
  message:string;
  Profile_Image = 'assets/images/profile.png';
  profile:Profile;
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
    this.account_id = localStorage.getItem("account_id");
    this.showSignout=true;
    this.auth = this.shared.getAuth();
    this.profSer.getProfiles(this.account_id)
      .subscribe((res: any) => {
        this.profiles=res.data;        
      }, error => () => { }, () => { });

  }
  filterProfilesOfType(type) {
    //return this.profiles.filter(x => x.status == type);
  }
  onAgeSelect(e) {
    this.age = e.target.value;
  }

  onSelectGender(e) {
    this.gender = e.target.value;
  }

  getLoginDetails(): string {
    let today = Date.now();
    let date = this.datePipe.transform(today, 'yMMMMd');
    let time = this.datePipe.transform(today, 'hh:mm a, Z');
    return date + time;
  }

  SaveProfile() {
    this.profSer.SaveProfile(this.account_id, this.age,this.gender)
      .subscribe((res) => { 
        this.message = "Profile Added Successfully";
        this.profSer.getProfiles(this.account_id)
        .subscribe((res: any) => {          
          this.profiles = res.data;
        }, error => () => { }, () => { });
      }, error => () => { }, () => { });

  }
  changegender(gender)
  {    
    this.gender=gender;
  }

}

import { Component, OnInit } from '@angular/core';
import { DataService} from '../data.service';
import { Observable} from 'rxjs';
import { AuthService } from '../providers/auth.service'
import { AccountService } from '../providers/account.service';
import { Account } from '../providers/account';
import { LoginService } from '../providers/login/login.service'
import { Login } from '../providers/login/login';
import { SharedDataService } from '../shared/shared-data.service';
import { SocialUser } from 'angular4-social-login';
import { GoogleLoginProvider } from 'angular4-social-login';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { PhoneNumber } from '../providers/phone/phone-number';
import { WindowService } from '../providers/phone/window.service';
import { environment } from '../../environments/environment';
import { AccountEmailFirebaseService } from '../providers/firebase/account-email-firebase.service';
import { AccountPhoneFirebaseService } from '../providers/firebase/account-phone-firebase.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AccountService, DatePipe, LoginService, AngularFireDatabase, AngularFireAuth, WindowService,SharedDataService]
})
export class LoginComponent implements OnInit {

  user = {
    email: '',
    password: ''
  };
  verificationCode: string;
  windowRef: any;
  private currentUser: firebase.User;
  model: any = {}; currentAccount: Account;
  message: string;
  errorMessage: string; 
  authState: any = null; name: string;
  private userDetails: firebase.User = null; authenticated: boolean = false;
  phoneNumber = new PhoneNumber()
  private activeUser: Observable<firebase.User>;
  ip:string;
  constructor(private logSer: LoginService,private accser: AccountService,private router: Router,private datePipe: DatePipe, private shared: SharedDataService,
    private authService: AuthService,
    public afAuth: AngularFireAuth, private db: AngularFireDatabase, private win: WindowService,
    private accountEmailFirebaseService: AccountEmailFirebaseService,
    private accountPhoneFirebaseService: AccountPhoneFirebaseService) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
      this.currentUser = this.afAuth.auth.currentUser
    });
    this.activeUser = afAuth.authState;
    this.activeUser.subscribe(

      (activeUser) => {
        if (activeUser) {
          this.currentUser = activeUser;
          console.log(this.currentUser);
        }
        else {
          this.currentUser = null;
        }
      }
    );
  }

  ngOnInit() {
    this.currentUser = null;

    this.windowRef = this.win.windowRef;

    // if (firebase.apps.length > 0) {
    //   console.log(firebase.apps[0].name);
    // }

    try {
      firebase.initializeApp(environment.firebase)
    } catch (error) {

    }
   

    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')
    this.windowRef.recaptchaVerifier
      .render()
      .then(widgetId => {

        this.windowRef.recaptchaWidgetId = widgetId
      });

      this.logSer.getIpCliente().subscribe((ip: string) => {
        this.ip = ip;
      }, error => () => { }, () => { });
  }
  
  sendLoginCode() {

    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = this.phoneNumber.e164;
    firebase.auth().signInWithPhoneNumber(num, appVerifier)
      .then(result => {
        this.windowRef.confirmationResult = result;
        console.log("Result is " + result);
        
       
      })
      .catch(error => console.log(error));
  }

  verifyLoginCode() {
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then(result => {
        this.currentUser = result.user;
       
        this.accountPhoneFirebaseService.getPhoneParentId(result.user.uid).then((parentId: string) => {
          this.shared.saveAuth(result.user.uid, result.user.phoneNumber, result.user.providerData[0].providerId, parentId)
          this.accser.saveAccount("",result.user.phoneNumber, result.user.uid,this.ip,result.user.providerData[0].providerId)
            .subscribe((data: string) => {
              this.addLoginInfo(data)
              document.getElementById('change_phone_dialog').click();
              
            }, error => () => { }, () => { });
        });
      })
      .catch(
          //error => console.log(error, "Incorrect code entered?"),
          error => this.errorMessage = "Incorrect code Entered");
   
      
  }

  loginWithGoogle() {
    this.authService.signInWithGoogle()
      .then((res) => {
        this.signIntoDB();
      })
      .catch((error) => {
        error => this.errorMessage = "Some error occurred";
        /*let result = this.linkAccount(error);
        if (result)
          this.signIntoDB();*/
      });
  }

  /*loginWithFacebook() {
    this.authService.signInWithFacebook()
      .then((res) => {
        this.signIntoDB();
      }).catch((error) => {
        let result = this.linkAccount(error);
        if (result)
          this.signIntoDB();
      });
  }*/

 /* loginWithTwitter() {
    this.authService.signInWithTwitter()
      .then((res) => {
        this.accser.saveAccountWithName(this.afAuth.auth.currentUser.displayName, this.afAuth.auth.currentUser.uid)
          .subscribe((data: string) => {
            this.addLoginInfo(data)
          }, error => () => { }, () => { });
      })
      .catch((error) => {
        let result = this.linkAccount(error);
        if (result)
          this.accser.saveAccountWithName(this.afAuth.auth.currentUser.displayName, this.afAuth.auth.currentUser.uid)
            .subscribe((data: string) => {
              this.addLoginInfo(data)
            }, error => () => { }, () => { });
      });
  }*/

  /*loginWithGithub() {
    this.authService.signInWithGithub()
      .then((res) => {
        this.signIntoDB();
      })
      .catch((error) => {
        let result = this.linkAccount(error);
        if (result)
          this.signIntoDB();
      });*/
  signUpWithGoogle() {
    window.open("https://accounts.google.com/signup/v2/webcreateaccount?service=mail&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&ltmpl=default&flowName=GlifWebSignIn&flowEntry=SignUp",
      "_blank", "toolbar=no,scrollbars=yes,resizable=no,top=10,left=200,width=1000,height=650")
  }

  signInWithEmail() {
    if(this.user.email.endsWith('@gmail.com')){
      this.message = "Please login with google";
    }
    else{
    this.authService.createUser(this.user.email, this.user.password)
      .then((res) => {
        //this.signIntoDB();
        this.accountEmailFirebaseService.getEmailParentId(res.user.uid).then((parentId: string) => {
          this.shared.saveAuth(res.user.uid, res.user.email, res.user.providerData[0].providerId, parentId)
          this.accser.saveAccount(this.user.email,this.phoneNumber, res.user.uid,this.ip,res.user.providerData[0].providerId)
            .subscribe((data: string) => {
              this.addLoginInfo(data)
              document.getElementById('change_email_dialog').click();
            }, error => () => { }, () => { });});
      })
      .catch((err) => {
        console.log(err);
        if (err.code == 'auth/email-already-in-use') {
          this.authService.signIn(this.user.email, this.user.password)
            .then((res) => {

              this.accountEmailFirebaseService.getEmailParentId(res.user.uid).then((parentId: string) => {
                this.shared.saveAuth(res.user.uid, res.user.email, res.user.providerData[0].providerId, parentId)
                this.accser.saveAccount(this.user.email,this.phoneNumber,res.user.uid,this.ip,res.user.providerData[0].providerId)
                  .subscribe((data: string) => {
                    this.addLoginInfo(data)
                    document.getElementById('change_email_dialog').click();
                  }, error => () => { }, () => { });
              });


            })
            .catch((error) => {
              this.message = error.message;
              console.log(error);

            });
        }
        else {
          this.message = "Email or Password Incorrect";
        }
      });
    }
  }


  linkAccount(error) {
    // var existingEmail = null;
    // var pendingCred = null;
    // // Account exists with different credential. To recover both accounts
    // // have to be linked but the user must prove ownership of the original
    // // account.
    // if (error.code == 'auth/account-exists-with-different-credential') {
    //   existingEmail = error.email;
    //   pendingCred = error.credential;
    //   // Lookup existing account’s provider ID.
    //   return firebase.auth().fetchProvidersForEmail(error.email)
    //     .then(function (providers) {
    //       if (providers.indexOf(firebase.auth.EmailAuthProvider.PROVIDER_ID) != -1) {
    //         // Password account already exists with the same email.
    //         // Ask user to provide password associated with that account.
    //         var password = window.prompt('Please provide the password for ' + existingEmail);
    //         return firebase.auth().signInWithEmailAndPassword(existingEmail, password);
    //       } else if (providers.indexOf(firebase.auth.GoogleAuthProvider.PROVIDER_ID) != -1) {
    //         var googProvider = new firebase.auth.GoogleAuthProvider();
    //         // Sign in user to Google with same account.
    //         googProvider.setCustomParameters({ 'login_hint': existingEmail });
    //         return firebase.auth().signInWithPopup(googProvider).then(function (result) {
    //           return result.user;
    //         });
    //       } else if (providers.indexOf(firebase.auth.FacebookAuthProvider.PROVIDER_ID) != -1) {
    //         var fbProvider = new firebase.auth.FacebookAuthProvider();
    //         // Sign in user to Google with same account.
    //         fbProvider.setCustomParameters({ 'login_hint': existingEmail });
    //         return firebase.auth().signInWithPopup(fbProvider).then(function (result) {
    //           return result.user;
    //         });
    //       }
    //       else if (providers.indexOf(firebase.auth.TwitterAuthProvider.PROVIDER_ID) != -1) {
    //         var twProvider = new firebase.auth.TwitterAuthProvider();
    //         // Sign in user to Google with same account.
    //         twProvider.setCustomParameters({ 'login_hint': existingEmail });
    //         return firebase.auth().signInWithPopup(twProvider).then(function (result) {
    //           return result.user;
    //         });
    //       }
    //       else if (providers.indexOf(firebase.auth.GithubAuthProvider.PROVIDER_ID) != -1) {
    //         var ghProvider = new firebase.auth.GithubAuthProvider();
    //         // Sign in user to Google with same account.
    //         ghProvider.setCustomParameters({ 'login_hint': existingEmail });
    //         return firebase.auth().signInWithPopup(ghProvider).then(function (result) {
    //           return result.user;
    //         });
    //       }
    //     })
    //     .then(function (user) {
    //       // Existing email/password or Google user signed in.
    //       // Link Facebook OAuth credential to existing account.
    //       return user.linkWithCredential(pendingCred);
    //     });
    // }
    throw error;
  }
  
  signIntoDB() {
    this.accser.saveAccount(this.afAuth.auth.currentUser.email,this.phoneNumber, this.afAuth.auth.currentUser.uid,this.ip,this.afAuth.auth.currentUser.providerId)
      .subscribe((data: string) => {
        this.addLoginInfo(data)
      }, error => () => { }, () => { });
  }


  getLoginDetails(): string {
    let today = Date.now();
    let date = this.datePipe.transform(today, 'yMMMMd');
    let time = this.datePipe.transform(today, 'hh:mm a, Z');
    return date + time;
  }

  showMail() {
    var x = document.getElementById('hidden-email-form')
    if (x.style.display === 'none')
      x.style.display = 'block';
    else
      x.style.display = 'none';
    document.getElementById('hidden-phone-form').style.display = 'none';
    document.getElementById('loginBox').style.paddingBottom = '40px';
  }

  showPhone() {
    var x = document.getElementById('hidden-phone-form')
    if (x.style.display === 'none')
      x.style.display = 'block';
    else
      x.style.display = 'none';
    document.getElementById('hidden-email-form').style.display = 'none';
  }

  addLoginInfo(account_id) {
    /*get logged in date and time*/
    let login = this.getLoginDetails();

    /* get the ip address */
    this.logSer.getIpCliente().subscribe((ip: string) => {
      this.logSer.addLoginDetails(account_id, ip, 'active', 'allowed', login)
        .subscribe((res1: Boolean) => {
          this.router.navigate(['subscription']);
           
        }, error => () => { }, () => { });
    }, error => () => { }, () => { });
  }
}


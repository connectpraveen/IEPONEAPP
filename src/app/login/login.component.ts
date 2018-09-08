import { Component, OnInit } from '@angular/core';
import { AccountService } from '../providers/account.service';
import { Account } from '../providers/account';
import { LoginService } from '../providers/login/login.service';
import { SharedDataService } from '../shared/shared-data.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../providers/auth.service'
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { PhoneNumber } from '../providers/phone/phone-number';
import { WindowService } from '../providers/phone/window.service';
import { environment } from '../../environments/environment';
import { AccountEmailFirebaseService } from '../providers/firebase/account-email-firebase.service';
import { AccountPhoneFirebaseService } from '../providers/firebase/account-phone-firebase.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [SharedDataService,AccountService, DatePipe, LoginService, AngularFireDatabase, AngularFireAuth, WindowService]
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

  constructor(private accser: AccountService, private router: Router, private shared: SharedDataService,
    private logSer: LoginService, private datePipe: DatePipe, private authService: AuthService,
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
         // console.log(this.currentUser);
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
  }
  
  sendLoginCode() {
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = this.phoneNumber.e164;
    firebase.auth().signInWithPhoneNumber(num, appVerifier)
      .then(result => {
        this.windowRef.confirmationResult = result;
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
          this.accser.saveAccountDataPhoneServlet(result.user.uid,'',result.user.phoneNumber,'',  result.user.providerData[0].providerId)
            .subscribe((data: any) => {      
              localStorage.setItem("uid",result.user.uid);           
              localStorage.setItem("account_id",data.id);             
              localStorage.setItem("email", result.user.phoneNumber);    
              localStorage.setItem("display_name", result.user.phoneNumber); 
              console.log("UID"+ result.user.uid);
              console.log("account_id"+data.id);
              console.log("Phone"+result.user.phoneNumber);
              //this.router.navigate(['Account']);                         
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
        let result = this.linkAccount(error);
        if (result)
         this.signIntoDB();
      });
  }

  signUpWithGoogle() {
    window.open("https://accounts.google.com/signup/v2/webcreateaccount?service=mail&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&ltmpl=default&flowName=GlifWebSignIn&flowEntry=SignUp",
      "_blank", "toolbar=no,scrollbars=yes,resizable=no,top=10,left=200,width=1000,height=650")
  }

  signInWithEmail() {
    // if(this.user.email.endsWith('@gmail.com')){
    //   this.message = "Please login with google";
    // }
    // else{
    this.authService.createUser(this.user.email, this.user.password)
      .then((res) => {
        this.signIntoDB();
        this.accountEmailFirebaseService.getEmailParentId(res.user.uid).then((parentId: string) => {
          this.shared.saveAuth(res.user.uid, res.user.email, res.user.providerData[0].providerId, parentId)
          this.accser.saveAccountDataEmailServlet(res.user.uid,this.user.email,'','',res.user.providerData[0].providerId)
            .subscribe((data: any) => {
              this.router.navigate(['Account']);          
            }, error => () => { }, () => { });});
      })
      .catch((err) => {
        console.log(err);
        if (err.code == 'auth/email-already-in-use') {
          this.authService.signIn(this.user.email, this.user.password)
            .then((res) => {

              this.accountEmailFirebaseService.getEmailParentId(res.user.uid).then((parentId: string) => {
                this.shared.saveAuth(res.user.uid, res.user.email, res.user.providerData[0].providerId, parentId)
                this.accser.saveAccountDataEmailServlet( res.user.uid,this.user.email,'','',res.user.providerData[0].providerId)
                  .subscribe((data: any) => {
                    this.router.navigate(['Account']);              
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
    //}
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
    this.logSer.getIpCliente().subscribe((ip: string) => {
    this.accser.saveAccountDataEmailServlet( this.afAuth.auth.currentUser.uid, this.afAuth.auth.currentUser.email,'',ip,'firebase')
      .subscribe((data:any) => {
        localStorage.setItem("account_id",data.id);             
        localStorage.setItem("email",this.afAuth.auth.currentUser.email);    
        localStorage.setItem("display_name",this.afAuth.auth.currentUser.displayName);       
        this.router.navigate(['Account']);
      }, error => () => { }, () => { })
    });    
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
  }

  showPhone() {
    var x = document.getElementById('hidden-phone-form')
    if (x.style.display === 'none')
      x.style.display = 'block';
    else
      x.style.display = 'none';
    document.getElementById('hidden-email-form').style.display = 'none';
  }

  addLoginInfo(account_id,login_id) {
    /* get the ip address */
    this.logSer.getIpCliente().subscribe((ip: string) => {
      this.logSer.addLoginDetails(account_id, ip, 'active', login_id, 'firebase')
        .subscribe((res1: Boolean) => {
          this.router.navigate(['Account']);
           
        }, error => () => { }, () => { });
    }, error => () => { }, () => { });
  }
}


 
 

  
  



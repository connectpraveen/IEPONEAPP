import { Component, OnInit } from '@angular/core';
import { AccountService } from '../providers/account.service';
import { Account } from '../providers/account';
import { LoginService } from '../providers/login/login.service';
import { Login } from '../providers/login/login';
import { SharedDataService } from '../shared/shared-data.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../providers/auth.service';
import { SlicePipe, Location } from '@angular/common';
import { environment } from '../../environments/environment';
import { User } from 'firebase';
import { PhoneNumber } from '../providers/phone/phone-number';
import { WindowService } from '../providers/phone/window.service';
import { DatePipe } from '@angular/common';
import { AccountEmailFirebaseService } from '../providers/firebase/account-email-firebase.service';
import { AccountGmailFirebaseService } from '../providers/firebase/account-gmail-firebase.service';
import { AccountPhoneFirebaseService } from '../providers/firebase/account-phone-firebase.service';
import { UserAssociateEmail, UserAssociatePhone } from './user-associate-email';
import * as firebase from 'firebase';
import { ActivatedRoute, Router, UrlSegment, ParamMap } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  providers: [AccountService, SharedDataService, LoginService, AuthService, WindowService, DatePipe]
})
export class AccountComponent implements OnInit {
  issecondory=true;
  EmailText="Email";
  grantSuccess:string;
  grantSuccessPhone:string;
  showVerificationCode = false;
  private currentUser: firebase.User;
  showSignout = false;
  currentUsername: string; authState: any = null;
  phoneNumber = new PhoneNumber();
  user: any;
  model: any = {};
  eMail = '';
  phone = '';
  phoneSaved = false;
  showPwdMessage = false;
  pwdMessage: string;
  verifyEMail: string;
  hideRepeat = true;
  showLoginDetails = false;
  loginDetails: Login[];
  enableSave = false;
  hideEmail = true;
  message: string;
  saveMessage: string;
  deleteMessage: string;
  savePhone: string;
  emailSaved = false;
  uid: string;
  emailVerified = false;
  windowRef: any;
  emlMsg: string; socialLogin = false; userId: string;
  loginCount = 0; reverse = true; order = 'last_login';
  userAssociateEmailModel = {
    email: '',
    password: ''
  };
  auth: any
  public associatedEmailAddresses: UserAssociateEmail[];
  public associatedPhones: UserAssociatePhone[];
  account_id: string;
  constructor(private router: Router, private accser: AccountService, private shared: SharedDataService,
    private logSer: LoginService, public afAuth: AngularFireAuth,
    private authService: AuthService,
    private win: WindowService, private datePipe: DatePipe,
    private accountEmailFirebaseService: AccountEmailFirebaseService,
    private accountGmailFirebaseService: AccountGmailFirebaseService,
    private accountPhoneFirebaseService: AccountPhoneFirebaseService) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
      this.currentUser = this.afAuth.auth.currentUser
    });
  }
  ngOnInit() {
    this.account_id = localStorage.getItem("account_id");
    this.uid = localStorage.getItem("uid");
    
    this.showSignout = true;
   
    this.auth = this.shared.getAuth();
    this.logSer.getAccountHolders(localStorage.getItem('email')).subscribe((data: any) => {
      this.emailVerified = false;
      if(localStorage.getItem("phonelogin")=="1")
      {
        this.emailVerified = true;
        this.EmailText="Phone";
      }
      if(localStorage.getItem("association_type")=="Primary")
      {
        this.issecondory = false;
      }
      data.accountHolders.forEach(element => {          
        if (String(element.accountHolderId).indexOf("@") > 0) {                            
            if (String(element.verification) == "Verified") {              
              this.emailVerified = true;              
            }          
        }
      });  
      
    });
    
    if (this.afAuth.auth.currentUser) {
      if (this.afAuth.auth.currentUser.email) {
        this.eMail = localStorage.getItem('email');
        this.emailVerified = this.afAuth.auth.currentUser.emailVerified;
        this.afAuth.auth.currentUser.reload();
      }
      // if (this.afAuth.auth.currentUser.displayName)
    

    }
    this.currentUsername = localStorage.getItem('display_name');
    this.eMail = localStorage.getItem('email');
    /* fetch user login details */
    this.logSer.getLoginDetails(this.uid)  
      .subscribe((data: any) => {        
        this.loginDetails = data.data;
        this.loginCount = data.data.length;
      }, error => () => { }, () => { });

    if (this.auth.parentId.length == 0) {
      this.auth.parentId = this.uid;
    }


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

    this.GetAccountHolders();
  }
  GetAccountHolders() {
    this.logSer.getAccountHolders(localStorage.getItem('email')).subscribe((data: any) => {
      this.associatedEmailAddresses = [];
      this.associatedPhones = [];
      data.accountHolders.forEach(element => {
        if (String(element.accountHolderId).indexOf("@") > 0)
          this.associatedEmailAddresses.push(element);
        else
          this.associatedPhones.push(element);
      });
    });
  }
  onSubscribe() {
    this.router.navigate(['Subscribe']);
  }

  onVerifyEmail() {
    this.currentUser = this.afAuth.auth.currentUser;
    this.verifyEMail = "Link hasbeen sent to your mail, please verify it";
    this.accser.sendemail(this.eMail,this.account_id)
      .subscribe((data: any) => {       
      }, error => () => { }, () => { });
  }

  onSaveChangedPwd() {
    if (this.afAuth.auth.currentUser) {
      this.currentUser = this.afAuth.auth.currentUser;
      this.afAuth.auth.sendPasswordResetEmail(this.currentUser.email).then(function () {
        // Email sent.
      }).catch((error) => {
        console.log(error)
      });
    }
  }

  onSaveEmail() {
    document.getElementById('input').style.border = 'blue';
    var input = (<HTMLInputElement>document.getElementById("input")).value;
    var pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (pattern.test(input)) {

      this.saveMessage = "Your Email has been changed";
      setTimeout(function () {
        document.getElementById('labelMessage').style.display = 'none';
      }, 5000);
      document.getElementById("emailSave").style.display = "none";
      document.getElementById('labelMessage').style.display = 'inline';
    }

  }
  onChangePhone() {
    document.getElementById("phoneSave").style.display = "inline";
    document.getElementById("phoneInput").setAttribute(
      "style", "border-color: rgba(66, 110, 244, 1); box - shadow: 2px 4px 4px rgba(229, 103, 23, 0.075) inset, 2px 2px 10px rgba(229, 103, 23, 0.6);  outline: 0 none;");
    (<HTMLInputElement>document.getElementById("phoneInput")).value = '';
    document.getElementById("phoneInput").setAttribute("placeholder", "Enter new Number and save");
  }
  onSavePhone() {
    document.getElementById('phoneInput').style.border = 'blue';
    var input = (<HTMLInputElement>document.getElementById("phoneInput")).value;
    var pattern = input.replace(/[^\d]/g, '');
    if (pattern.length > 9 && pattern.length < 14) {
      this.savePhone = "Your Phone number has been changed";
      setTimeout(function () {
        document.getElementById('labelMessagePhone').style.display = 'none';
      }, 5000);
      document.getElementById("phoneSave").style.display = "none";
      document.getElementById('labelMessage').style.display = 'inline';
    }
  }

  onShowPlatformLogin() {
    if (document.getElementById("loginhistory").hidden == true)
      document.getElementById("loginhistory").hidden = false;
    else
      document.getElementById("loginhistory").hidden = true;
  }

  onDeleteAssociateEmail(id: string) {
    this.logSer.deleteAccountHolders(id).subscribe((data: any) => {
      this.grantSuccess="";
      this.grantSuccessPhone="";
      this.GetAccountHolders();
    });

  }

  onGrantAssociateEmail(id: string, accountHolderId:string, Verified:string) {
    this.accser.updateAccountHolderGrant(id,this.account_id,"Firebase",accountHolderId,Verified).subscribe((data: any) => {  
      this.grantSuccess="Grant was successful!"
      this.GetAccountHolders();
    }, error => () => { }, () => { });
  }

  onGrantAssociatePhone(id: string, accountHolderId:string, Verified:string) {
    this.accser.updateAccountHolderGrant(id,this.account_id,"Firebase",accountHolderId,Verified).subscribe((data: any) => {  
      this.grantSuccessPhone="Grant was successful!"
      this.GetAccountHolders();
    }, error => () => { }, () => { });
  }
  loginWithGoogle() {
    var dbContext = this.GetDBContext();
    this.authService.signInWithGoogleAssociated()
      .then((res) => {
        this.signIntoDB();
        this.accountGmailFirebaseService.add({
          childId: res.user.uid,
          //password: 'abcd',
          parentId: this.auth.parentId, // parent-Id of current login user
          email: res.user.email
        });  
        this.accser.sendemail(res.user.email,this.account_id)
        .subscribe((data: any) => {       
        }, error => () => { }, () => { });     // this.signIntoDB();
      })
      .catch((error) => {
        /*let result = this.linkAccount(error);
        if (result)
          this.signIntoDB();*/
      });
  }


  onSaveAssociateEmailAddress() {
    var dbContext = this.GetDBContext();
    //check email and password 
    var input = (<HTMLInputElement>document.getElementById("input_addemail")).value;
    var pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var password = (<HTMLInputElement>document.getElementById("input_addpassword")).value;
    var passwordPattern = /^([a-zA-Z0-9_\.\-]{6,})+$/;
    if (pattern.test(input) && passwordPattern.test(password)) {
      this.authService.createUserWithoutSignIn(this.userAssociateEmailModel.email, this.userAssociateEmailModel.password, dbContext)
        .then((res) => {
          this.accountEmailFirebaseService.add({
            childId: res.user.uid,
            password: this.userAssociateEmailModel.password,
            parentId: this.auth.parentId, // parent-Id of current login user
            email: this.userAssociateEmailModel.email
          });
          this.accser.SaveAssociatedEmailWithPassword(this.account_id, this.userAssociateEmailModel.email);
          document.getElementById('addEmailModal').click();
          (<HTMLInputElement>document.getElementById("input_addemail")).value = '';
          (<HTMLInputElement>document.getElementById("input_addpassword")).value = '';
        }).catch((err) => {
          document.getElementById('addMessage').innerText = "This Email is already in use";
          this.message = "This Email is already in use";
        });
    }
    else {
      document.getElementById('addMessage').innerText = "Email or Password Invalid!";
      this.message = "Email or Password Invalid!";
    }
    this.message = '';
  }

  onSaveAssociateEmailPwdAddress() {
    var input = (<HTMLInputElement>document.getElementById("input_addemailpwd")).value;
    var pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var pwd = this.randomPwdGenerator();
    if (pattern.test(input)) {
      this.logSer.addAccountHolders(this.account_id, input)
        .subscribe((data: any) => {
          this.authService.createUser(input, pwd)
          .then((res) => {     
            this.afAuth.auth.sendPasswordResetEmail(input).then(function () {                 
            }).catch((error) => {            
            }); 
          })
          .catch((err) => {       
            if (err.code == 'auth/email-already-in-use') {    
              this.afAuth.auth.sendPasswordResetEmail(input).then(function () {            
              }).catch((error) => {            
              });            
            }
            else {         
            }
          });
       
          this.GetAccountHolders();           
          this.grantSuccess="Email has been added and password reset link has been sent";
          document.getElementById('addframeEmailModal').click();
        }, error => () => { }, () => { });
    }
    else {
      document.getElementById('addMessage1').innerText = "Email Invalid!";
      this.message = "Email Invalid!";
    }
    this.message = '';
  }

  randomPwdGenerator() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }


  sendLoginCode() {
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = this.phoneNumber.e164;
    firebase.auth().signInWithPhoneNumber(num, appVerifier)
      .then(result => {
        this.windowRef.confirmationResult = result;
        document.getElementById('showVerificationCode').hidden = false;
      })
      .catch(error => console.log(error));
  }

  verificationCode: string;
  verifyLoginCode() {
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then(result => {
        this.addPhone();
        document.getElementById('btnframeModalPhone').click();
      })
      .catch(error => console.log(error, "Incorrect code entered?"));
  }

  addPhone() {
    this.logSer.addAccountHolders(this.account_id, this.phoneNumber.e164).subscribe((data: any) => {
      this.GetAccountHolders();
    });

  }

  onDeleteAssociatePhone(id: string) {
    this.logSer.deleteAccountHolders(id).subscribe((data: any) => {
      this.grantSuccess="";
      this.grantSuccessPhone="";
      this.GetAccountHolders();
    });

  }

  private GetDBContext(): any {

    let dbContext_name: string = "iepone";
    var secondayFirebase: any = null;

    for (var i = 0; i <= firebase.apps.length - 1; i++) {
      if (firebase.apps[i].name == dbContext_name) {
        secondayFirebase = firebase.apps[i];
        break;
      }
    }

    if (secondayFirebase == null)
      secondayFirebase = firebase.initializeApp(environment.firebase, dbContext_name);

    return secondayFirebase;
  }

  signIntoDB() {
    this.logSer.addAccountHolders(this.account_id, this.afAuth.auth.currentUser.email)
      .subscribe((data: any) => {
        this.GetAccountHolders();
      }, error => () => { }, () => { });
  }

  addLoginInfo(account_id) {
    /*get logged in date and time*/
    let login = this.getLoginDetails();

    /* get the ip address */
    this.logSer.getIpCliente().subscribe((ip: string) => {
      this.logSer.addLoginDetails(account_id, ip, 'active', 'allowed', login)
        .subscribe((res1: Boolean) => {
          //this.router.navigate(['Subscription']);

        }, error => () => { }, () => { });
    }, error => () => { }, () => { });
  }
  getLoginDetails(): string {
    let today = Date.now();
    let date = this.datePipe.transform(today, 'yMMMMd');
    let time = this.datePipe.transform(today, 'hh:mm a, Z');
    return date + time;
  }

}
